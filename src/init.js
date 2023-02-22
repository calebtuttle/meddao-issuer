import assert from "assert";
import { ethers } from "ethers";
import { initialize } from "zokrates-js";
import dotenv from "dotenv";
import dynamodb from "./utils/dynamodb.js";
dotenv.config();

function validateEnv() {
  assert.ok(
    process.env.HOLONYM_ISSUER_PRIVKEY,
    "HOLONYM_ISSUER_PRIVKEY environment variable is not set"
  );
  assert.ok(process.env.NODE_ENV, "NODE_ENV environment variable is not set");
  assert.ok(
    process.env.ALCHEMY_APIKEY,
    "ALCHEMY_APIKEY environment variable is not set"
  );
  assert.ok(
    process.env.AWS_ACCESS_KEY_ID,
    "AWS_ACCESS_KEY_ID environment variable is not set"
  );
  assert.ok(
    process.env.AWS_SECRET_ACCESS_KEY,
    "AWS_SECRET_ACCESS_KEY environment variable is not set"
  );
}

async function initializeDatabase() {
  await dynamodb.createUsersTableIfNotExists();
}

validateEnv();

initializeDatabase();

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

export { zokProvider, alchemyProviders };
