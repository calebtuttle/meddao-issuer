import {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

/**
 * @typedef User
 * @property {string} id - uuid used as a private identifier across requests
 * @property {string} npiNumber - must be encoded as a string.
 * @property {number} specialty - must be encoded as a number.
 * @property {string} license
 * @property {string} medicalCredentials - "MD" or "DO"
 * @property {number} [retrievedCredentialsAt] - UNIX timestamp at which the user was issued
 * their credentials from this issuer (unrelated to medical credentials)
 */

const UsersTableName =
  process.env.NODE_ENV == "development"
    ? "MedicalCredentialsIssuer-Users-dev"
    : "MedicalCredentialsIssuer-Users";

const ddbClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

const createUsersTableIfNotExists = async () => {
  try {
    const params = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "npiNumber",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          KeyType: "HASH",
          AttributeName: "id",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      TableName: UsersTableName,
      GlobalSecondaryIndexes: [
        {
          IndexName: "npiNumberIndex",
          KeySchema: [
            {
              AttributeName: "npiNumber",
              KeyType: "HASH",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      ],
      StreamSpecification: {
        StreamEnabled: false,
      },
    };
    // CreateTableCommand throws if table already exists.
    const data = await ddbClient.send(new CreateTableCommand(params));
    console.log(`${UsersTableName} table created in DynamoDB`, data);
  } catch (err) {
    if (err.name === "ResourceInUseException") {
      console.log(`${UsersTableName} table already exists in DynamoDB`);
    } else {
      throw err;
    }
  }
};

/**
 * Put a user in the database. Only include the required fields.
 * @param {string} id - uuid
 * @param {string} npiNumber - must be encoded as a string.
 * @param {number} specialty - must be encoded as a number.
 * @param {string} license
 * @param {string} medicalCredentials - "MD" or "DO"
 */
async function putMinimalUser(id, npiNumber, specialty, license, medicalCredentials) {
  try {
    await ddbClient.send(
      new PutItemCommand({
        TableName: UsersTableName,
        Item: {
          id: {
            S: id,
          },
          npiNumber: {
            S: npiNumber,
          },
          specialty: {
            N: specialty.toString(),
          },
          license: {
            S: license,
          },
          medicalCredentials: {
            S: medicalCredentials,
          },
        },
      })
    );
    console.log(`Put user with npiNumber ${npiNumber} in ${UsersTableName} table`);
  } catch (err) {
    console.error("putMinimalUser encountered error: ", err.message);
  }
}

async function updateUserRetrievedCredsAt(id, retrievedCredentialsAt) {
  try {
    await ddbClient.send(
      new UpdateItemCommand({
        TableName: UsersTableName,
        key: {
          id: {
            S: id,
          },
        },
        UpdateExpression: "SET retrievedCredentialsAt = :r",
        ExpressionAttributeValues: {
          ":r": {
            S: retrievedCredentialsAt,
          },
        },
      })
    );
    console.log(`Updated user with id ${id} to ${UsersTableName} table`);
  } catch (err) {
    console.error("updateUserRetrievedCredsAt encountered error: ", err.message);
  }
}

async function getUserById(id) {
  try {
    const data = await ddbClient.send(
      new GetItemCommand({
        TableName: UsersTableName,
        Key: {
          id: {
            S: id,
          },
        },
      })
    );
    return data?.Item;
  } catch (err) {
    console.error("getUserById encountered error: ", err.message);
  }
}

async function getUserByNpiNumber(npiNumber) {
  try {
    const data = await ddbClient.send(
      new QueryCommand({
        TableName: UsersTableName,
        IndexName: "npiNumberIndex",
        KeyConditionExpression: "npiNumber = :npiNumber",
        ExpressionAttributeValues: {
          ":npiNumber": {
            S: npiNumber,
          },
        },
      })
    );
    return data?.Items?.[0];
  } catch (err) {
    console.error("getUserByNpiNumber encountered error: ", err.message);
  }
}

export {
  UsersTableName,
  ddbClient,
  createUsersTableIfNotExists,
  putMinimalUser,
  updateUserRetrievedCredsAt,
  getUserById,
  getUserByNpiNumber,
};
export default {
  createUsersTableIfNotExists,
  putMinimalUser,
  updateUserRetrievedCredsAt,
  getUserById,
  getUserByNpiNumber,
};
