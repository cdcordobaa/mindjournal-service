import { APIGatewayProxyHandler } from "aws-lambda";
import { getAllTasksUseCase } from "../../application/usecases";
import { success, failure } from "../../utils/responses";

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const tasks = await getAllTasksUseCase();
    return success({ tasks });
  } catch (error) {
    return failure({ message: error.message });
  }
};
