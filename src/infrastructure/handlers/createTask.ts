import { APIGatewayProxyHandler } from 'aws-lambda'

import { TaskDto } from "../../domain/entities/task";
import { parseAndValidateTaskDto } from "../../utils/validators";
import { createTaskUseCase } from "../../application/usecases";
import { failure, success } from "../../utils/responses";

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
