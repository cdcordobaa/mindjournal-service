import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

let options: DynamoDBClientConfig = {
  region: process.env.AWS_REGION,
};

// connect to local DB if running offline

// if (process.env.IS_OFFLINE) {
//   options = {
//     region: "localhost",
//     endpoint: "http://localhost:8000",
//   };
// }

export const client = new DynamoDBClient(options);
