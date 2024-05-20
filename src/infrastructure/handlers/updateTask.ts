import { APIGatewayProxyHandler } from "aws-lambda";
import { TaskDto } from "../../domain/entities/task";
import { parseAndValidateTaskDto } from "../../utils/validators";
import { updateTaskUseCase } from "../../application/usecases";
import { success, failure } from "../../utils/responses";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskDto: TaskDto = await parseAndValidateTaskDto(event.body);
    const task = await updateTaskUseCase(taskDto);

    return success({ task });
  } catch (error) {
    return failure({ message: error.message });
  }
};
