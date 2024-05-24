import { APIGatewayProxyHandler } from "aws-lambda";
import { createTaskUseCase } from "../../application/usecases";
import { TaskDto } from "../../domain/entities/task";
import { success, failure } from "../../utils/responses";
import { parseAndValidateTaskDto } from "../../utils/validators";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const taskDto: TaskDto = await parseAndValidateTaskDto(event.body);
    const task = await createTaskUseCase(taskDto);
    console.log("task", task);

    return success({ task });
  } catch (error) {
    return failure({ message: error.message });
  }
};
