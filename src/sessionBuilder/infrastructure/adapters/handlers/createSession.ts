import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { MikroLog } from "mikrolog";

import { CreateSessionUseCase } from "../../../application/usecases/CreateSessionUseCase";

import { UnsupportedVersionError } from "../../../errors/UnsupportedVersionError";

import { setupDependencies } from "../../utils/setupDependencies";
import { getVersion } from "../../utils/getVersion";
import { setCorrelationId } from "../../utils/userMetadata";

import { metadataConfig } from "../../../config/metadata";

interface SessionCreationInput {
  userId: string;
  emotionalState: { details: string };
  settings: {
    language: string;
    soundscape: string;
    narrator: string;
    duration: string;
  };
  files: Record<string, any>;
}

/**
 * @description Create a new session based on user input.
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    MikroLog.start({
      metadataConfig: { ...metadataConfig, service: "CreateSession" },
      event,
      context,
    });

    if (getVersion(event) !== 1) throw new UnsupportedVersionError();

    setCorrelationId(event, context);

    const sessionInput: SessionCreationInput = JSON.parse(event.body);

    const dependencies = setupDependencies(metadataConfig("CreateSession"));

    await CreateSessionUseCase(dependencies, sessionInput);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Session created successfully" }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
}
