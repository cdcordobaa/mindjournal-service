import { APIGatewayProxyHandler } from "aws-lambda";
import { success, failure } from "../../utils/responses";
import { getTaskByIdUseCase } from "../../application/usecases";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskId = event.pathParameters?.taskId;
    if (!taskId) {
      return failure({ message: "Task ID is required" });
    }

    const task = await getTaskByIdUseCase(taskId);
    if (!task) {
      return failure({ message: "Task not found" });
    }

    return success({ task });
  } catch (error) {
    return failure({ message: error.message });
  }
};
