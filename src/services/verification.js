import axios from "axios";
import ethersPkg from "ethers";
const { ethers } = ethersPkg;
import { poseidon } from "circomlibjs-old";
import { v4 as uuidV4 } from "uuid";
import { zokProvider, alchemyProviders } from "../init.js";
import { issue } from "holonym-wasm-issuer";
import { specialtyToTokenID } from "../constants/index.js";
import contractAddresses from "../constants/contract-addresses.js";
import ABIs from "../constants/abis.js";
import { logWithTimestamp } from "../utils/utils.js";
import dynamodb from "../utils/dynamodb.js";

async function validatePostRequestParams(firstName, lastName, npiNumber, proof) {
  if (!firstName || !lastName || !npiNumber || !proof) {
    return {
      error: true,
      message: "Missing required parameters",
    };
  }

  // Verify proof
  try {
    // public proof inputs: root, issuerAddr, firstName, lastName,
    const rootsContract = new ethers.Contract(
      process.env.NODE_ENV == "development"
        ? contractAddresses.Roots.testnet["optimism-goerli"]
        : contractAddresses.Roots.mainnet["optimism"],
      ABIs.Roots,
      process.env.NODE_ENV == "development"
        ? alchemyProviders["optimism-goerli"]
        : alchemyProviders.optimism
    );
    const rootIsRecent = await rootsContract.rootIsRecent(proof.inputs[0]);
    if (!rootIsRecent) {
      return {
        error: true,
        message: "Merkle root is not recent",
      };
    }
    const verifKeyResp = await axios.get(
      "https://preproc-zkp.s3.us-east-2.amazonaws.com/govIdFirstNameLastName.verifying.key"
    );
    const verificationKey = verifKeyResp.data;
    const isVerified = zokProvider.verify(verificationKey, proof);
    if (!isVerified) {
      console.log("isVerified", isVerified);
      return { error: true, message: "Proof is invalid" };
    }
  } catch (err) {
    console.log(err);
    return { error: true, message: "An error occurred while verifying proof" };
  }

  // Verify that issuer address in proof matches the address of the Holonym government ID issuer
  const govIdIssuerAddr =
    "0x03fae82f38bf01d9799d57fdda64fad4ac44e4c2c2f16c5bf8e1873d0a3e1993";
  if (proof.inputs[1] !== govIdIssuerAddr) {
    return {
      error: true,
      message:
        "Issuer address in proof does not match the address of the Holonym government ID issuer",
    };
  }

  // Verify that first name and last name inputs in proof match ones provided by user
  const encoder = new TextEncoder();
  const firstNameEncoded = ethers.BigNumber.from(
    encoder.encode(firstName)
  ).toHexString();
  if (firstNameEncoded != ethers.BigNumber.from(proof.inputs[2]).toHexString()) {
    return {
      error: true,
      message: "First name in proof does not match first name provided by user",
    };
  }
  const lastNameEncoded = ethers.BigNumber.from(
    encoder.encode(lastName)
  ).toHexString();
  if (lastNameEncoded != ethers.BigNumber.from(proof.inputs[3]).toHexString()) {
    console.log("lastNameEncoded", lastNameEncoded);
    return {
      error: true,
      message: "Last name in proof does not match last name provided by user",
    };
  }

  return {
    error: false,
    message: "Valid parameters",
  };
}

// User requests verification
async function handlePost(req, res) {
  logWithTimestamp("POST /verification: Entered");

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const npiNumber = req.body.npiNumber;
  const proof = req.body.proof;

  const validationResult = await validatePostRequestParams(
    firstName,
    lastName,
    npiNumber,
    proof
  );
  if (validationResult.error) {
    logWithTimestamp(
      `POST /verification: Invalid parameters. ${validationResult.message}`
    );
    return res.status(400).json(validationResult);
  }

  // Query the NPI registry to confirm that the NPI number, first name, and last name all belong
  // to a single person in the registry.
  const resp = await axios.get(
    `https://npiregistry.cms.hhs.gov/api/?number=${npiNumber}&first_name=${firstName}&last_name=${lastName}&country_code=&limit=&skip=&pretty=&version=2.1`
  );
  const npiRegistryData = resp.data;
  console.log("npiRegistryData", JSON.stringify(npiRegistryData, null, 2));
  if (npiRegistryData?.Errors?.length > 0) {
    logWithTimestamp(
      `POST /verification: Could not find NPI record for first name ${firstName}, last name ${lastName}, and NPI number ${npiNumber}`
    );
    return res.status(400).json({
      error: true,
      message: "Could not find NPI record",
    });
  }
  if (npiRegistryData.result_count == 0) {
    logWithTimestamp(
      `POST /verification: Could not find NPI record for first name ${firstName}, last name ${lastName}, and NPI number ${npiNumber}`
    );
    return res.status(400).json({
      error: true,
      message: "Could not find NPI record",
    });
  }
  const npiResult = npiRegistryData.results[0];
  // It is necessary to check names for equality because the NPI registry will return a result
  // even if the name only partially matches the query.
  if (npiResult.basic?.first_name.toLowerCase() != firstName.toLowerCase()) {
    logWithTimestamp(
      `POST /verification: First name in NPI registry does not match first name provided by user. First name in NPI registry: ${npiResult.basic.first_name}, first name provided by user: ${firstName}`
    );
    return res.status(400).json({
      error: true,
      message: "First name in NPI registry does not match first name provided by user",
    });
  }
  if (npiResult.basic?.last_name.toLowerCase() != lastName.toLowerCase()) {
    logWithTimestamp(
      `POST /verification: Last name in NPI registry does not match last name provided by user. Last name in NPI registry: ${npiResult.basic.last_name}, last name provided by user: ${lastName}`
    );
    return res.status(400).json({
      error: true,
      message: "Last name in NPI registry does not match last name provided by user",
    });
  }
  const validCredentialTypes = ["M.D.", "MD", "D.O.", "DO"];
  if (!validCredentialTypes.includes(npiResult.basic?.credential)) {
    logWithTimestamp(
      `POST /verification: User's credential type is not valid. Credential: ${npiResult.basic.credential}`
    );
    return res.status(400).json({
      error: true,
      message: "User's credential type is not valid",
    });
  }
  const primaryTaxonomy = (npiResult.taxonomies ?? []).find(
    (taxonomy) => taxonomy.primary === true
  );
  if (!primaryTaxonomy?.license) {
    logWithTimestamp(
      `POST /verification: NPI registry does not list a license for this user. NPI number: ${npiNumber}`
    );
    return res.status(400).json({
      error: true,
      message: "NPI registry does not list a license for this user",
    });
  }
  if (!primaryTaxonomy?.desc) {
    logWithTimestamp(
      `POST /verification: NPI registry does not list a specialty for this user. NPI number: ${npiNumber}`
    );
    return res.status(400).json({
      error: true,
      message: "NPI registry does not list a specialty for this user",
    });
  }

  let specialtyAsNumber;
  for (const specialty of Object.keys(specialtyToTokenID)) {
    if (primaryTaxonomy.desc.toLowerCase().includes(specialty.toLowerCase())) {
      specialtyAsNumber = specialtyToTokenID[specialty];
      break;
    }
  }
  if (typeof specialtyAsNumber !== "number") {
    logWithTimestamp(
      `POST /verification: Unsupported specialty. NPI number: ${npiNumber}, specialty: ${primaryTaxonomy.desc}`
    );
    return res.status(400).json({
      error: true,
      message: "Unsupported specialty",
    });
  }

  const currentUser = await dynamodb.getUserByNpiNumber(npiNumber);

  if (currentUser && currentUser.retrievedCredentialsAt?.S) {
    logWithTimestamp(
      `POST /verification: User has already been issued credentials. NPI number: ${npiNumber}`
    );
    return res.status(400).json({
      error: true,
      message: "User has already been issued credentials",
    });
  } else if (currentUser && !currentUser.retrievedCredentialsAt?.S) {
    logWithTimestamp(
      `POST /verification: User has already submitted a verification request. NPI number: ${npiNumber}. ID: ${currentUser.id}`
    );
    return res.status(400).json({
      error: true,
      message: "User has already submitted a verification request",
    });
  }

  const id = uuidV4();
  await dynamodb.putMinimalUser(
    id,
    npiNumber,
    specialtyAsNumber,
    primaryTaxonomy.license,
    // standardize medical credentials string so that it is always either "MD" or "DO"
    npiResult.basic.credential.replaceAll(".", "").toUpperCase()
  );
  logWithTimestamp(
    `POST /verification: Saved verification request to database. NPI number: ${npiNumber}`
  );

  return res.status(200).json({
    message:
      "Verification request successful. You can retrieve your signed credentials using the provided ID.",
    id: id,
  });
}

// GET endpoint signs the user's credentials and returns them to the user. This
// endpoint should be called in the store-credentials component in the Holonym frontend.
async function handleGetCredentials(req, res) {
  logWithTimestamp("GET /verification/credentials: Entered");

  if (process.env.NODE_ENV == "development") {
    const npiNumber = "123";
    const specialty = "0";
    const license = "456";
    const medicalCredentials = "MD";
    const npiNumLicenseMedCredsHash = ethers.BigNumber.from(
      poseidon([
        ethers.BigNumber.from(npiNumber),
        ethers.BigNumber.from(Buffer.from(license)),
        ethers.BigNumber.from(Buffer.from(medicalCredentials)),
      ])
    ).toString();
    const metadata = {
      rawCreds: {
        specialty: specialty,
        npiNumber: npiNumber,
        license: license,
        medicalCredentials: medicalCredentials,
      },
      derivedCreds: {
        npiNumLicenseMedCredsHash: {
          value: npiNumLicenseMedCredsHash,
          derivationFunction: "poseidon",
          inputFields: [
            "rawCreds.npiNumber",
            "rawCreds.license",
            "rawCreds.medicalCredentials",
          ],
        },
      },
      fieldsInLeaf: [
        "issuer",
        "secret",
        "rawCreds.specialty",
        "derivedCreds.npiNumLicenseMedCredsHash.value",
        "iat",
        "scope",
      ],
    };
    const response = issue(
      process.env.HOLONYM_ISSUER_PRIVKEY,
      specialty,
      npiNumLicenseMedCredsHash
    );
    response.metadata = metadata;
    return res.status(200).json(response);
  }

  // const npiNumber = req.query.npiNumber;
  const id = req.query.id;

  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Missing ID",
    });
  }

  const user = await dynamodb.getUserById(id);

  if (!user) {
    return res.status(400).json({
      error: true,
      message: "User not found",
    });
  }
  if (user.retrievedCredentialsAt?.S) {
    return res.status(400).json({
      error: true,
      message: "User has already retrieved credentials",
    });
  }

  // NOTE: Re: specialty being encoded as a number:
  // Morgan Stuart of MedDAO: "when @gcecil made the Edition contract on thirdweb
  // to mint the NFT’s he assigned a number to each specialty— actually becomes
  // very important because that is how we will achieve organizational structure
  // within medDAO and its tools/primitives

  const npiNumLicenseMedCredsHash = ethers.BigNumber.from(
    poseidon([
      ethers.BigNumber.from(user.npiNumber.S),
      ethers.BigNumber.from(Buffer.from(user.license.S)),
      ethers.BigNumber.from(Buffer.from(user.medicalCredentials.S)),
    ])
  ).toString();
  const metadata = {
    rawCreds: {
      specialty: user.specialty.N,
      npiNumber: user.npiNumber.S,
      license: user.license.S,
      medicalCredentials: user.medicalCredentials.S,
    },
    derivedCreds: {
      npiNumLicenseMedCredsHash: {
        value: npiNumLicenseMedCredsHash,
        derivationFunction: "poseidon",
        inputFields: [
          "rawCreds.npiNumber",
          "rawCreds.license",
          "rawCreds.medicalCredentials",
        ],
      },
    },
    fieldsInLeaf: [
      "issuer",
      "secret",
      "rawCreds.specialty",
      "derivedCreds.npiNumLicenseMedCredsHash.value",
      "iat",
      "scope",
    ],
  };

  const response = issue(
    process.env.HOLONYM_ISSUER_PRIVKEY,
    user.specialty.N,
    npiNumLicenseMedCredsHash
  );
  response.metadata = metadata;

  await dynamodb.updateUserRetrievedCredsAt(user.id, new Date().getTime());

  return res.status(200).json(response);
}

export { handlePost, handleGetCredentials };
