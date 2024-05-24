import { APIGatewayProxyHandler } from "aws-lambda";
import { SessionInputDto } from "../../domain/entities/sessionInputDto";
import { parseAndValidateSessionInputDto } from "../../validators/validators";
import { createSessionInputUseCase } from "../../application/usecases";
import { success, failure } from "../../../utils/responses";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const sessionInputDto: SessionInputDto =
      await parseAndValidateSessionInputDto(event.body);
    const sessionInput = await createSessionInputUseCase(sessionInputDto);
    return success({ sessionInput });
  } catch (error) {
    return failure({ message: error.message });
  }
};
