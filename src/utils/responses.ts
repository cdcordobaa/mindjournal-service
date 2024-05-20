import { APIGatewayProxyResult } from "aws-lambda";

const buildResponse = (
  statusCode: number,
  body: Record<string, any>,
): APIGatewayProxyResult => {
  return {
    statusCode,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};

export const success = (body: Record<string, any>): APIGatewayProxyResult => {
  return buildResponse(200, body);
};

export const failure = (body: Record<string, any>): APIGatewayProxyResult => {
  console.log(JSON.stringify(body, null, 2));
  return buildResponse(500, body);
};
