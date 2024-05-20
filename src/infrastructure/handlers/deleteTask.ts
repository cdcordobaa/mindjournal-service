import { APIGatewayProxyHandler } from "aws-lambda";
import { success, failure } from "../../utils/responses";
import { deleteTaskUseCase } from "../../application/usecases";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskId = event.pathParameters?.taskId;
    if (!taskId) {
      return failure({ message: "Task ID is required" });
    }
    await deleteTaskUseCase(taskId);
    return success({ message: "Task deleted successfully" });
  } catch (error) {
    return failure({ message: error.message });
  }
};
