import assert from "assert";
import mongoose from "mongoose";
import { ethers } from "ethers";
import { initialize } from "zokrates-js";
import dotenv from "dotenv";
dotenv.config();

const { Schema } = mongoose;
if (process.env.NODE_ENV == "development") mongoose.set("debug", true);

function validateEnv() {
  assert.ok(
    process.env.HOLONYM_ISSUER_PRIVKEY,
    "HOLONYM_ISSUER_PRIVKEY environment variable is not set"
  );

  assert.ok(process.env.NODE_ENV, "NODE_ENV environment variable is not set");

  assert.ok(
    process.env.MONGO_DB_CONNECTION_STR,
    "MONGO_DB_CONNECTION_STR environment variable is not set"
  );
}

async function initializeMongoDb() {
  if (process.env.NODE_ENV != "development") {
    // TODO: Connect to production MongoDB database
  }

  try {
    const mongoConfig = {
      ssl: true,
      sslValidate: true,
      // sslCA: `${__dirname}/../../${process.env.MONGO_CERT_FILE_NAME}`, // for production
    };
    await mongoose.connect(
      process.env.MONGO_DB_CONNECTION_STR,
      process.env.NODE_ENV == "development" ? {} : mongoConfig
    );
    console.log("Connected to MongoDB database.");
  } catch (err) {
    console.log("Unable to connect to MongoDB database.", err);
    return;
  }
  const userVerificationSchema = new Schema({
    // TODO: Do we need more info than NPI number? For Sybil resistance, NPI number is probably enough.
    // We include an id field as a _private_ identifier that the user can use to retrieve their credentials.
    // We do not use NPI number as the identifier used to retrieve credentials because it is publicly known.
    id: {
      type: String,
      required: true,
    },
    npiNumber: {
      type: String,
      required: true,
    },
  });
  const UserVerification = mongoose.model("UserVerification", userVerificationSchema);
  return { UserVerification };
}

validateEnv();

let UserVerification;
initializeMongoDb().then((result) => {
  if (result) {
    UserVerification = result.UserVerification;
  } else {
    console.log("MongoDB initialization failed");
  }
});

let zokProvider;
initialize().then((provider) => {
  zokProvider = provider;
});

const alchemyProviders = {
  optimism: new ethers.providers.AlchemyProvider(
    "optimism",
    process.env.ALCHEMY_APIKEY
  ),
  "optimism-goerli": new ethers.providers.AlchemyProvider(
    "optimism-goerli",
    process.env.ALCHEMY_APIKEY
  ),
};

export { mongoose, UserVerification, zokProvider, alchemyProviders };
