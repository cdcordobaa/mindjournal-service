import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { MikroLog } from "mikrolog";

import { CreateSessionUseCase } from "../../../application/usecases/createSessionUseCase";

import { setupDependencies } from "../../utils/setupDependencies";

import { metadataConfig } from "../../../config/metadata";
import { failure, success } from "../../utils/responses";
import { parseAndValidateSessionCreationInput } from "../../utils/validators/validators";
import { CreateSessionInput } from "../../../interfaces/SessionInput";

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

    const dependencies = setupDependencies(metadataConfig("CreateSession"));

    const sessionInput: CreateSessionInput =
      await parseAndValidateSessionCreationInput(event.body);

    const session = await CreateSessionUseCase(dependencies, sessionInput);

    console.log("session", session);

    return success({ session });
  } catch (error) {
    return failure({ message: error.message });
  }
}
