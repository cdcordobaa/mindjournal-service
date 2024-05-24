import { client } from "../../config/dynamoDBClient";
import { createTaskRepository } from "../../infrastructure/repositories/session.repository";
import { createTaskUseCaseImplementation } from "./createTask.usecase";
import { deleteTaskUseCaseImplementation } from "./deleteTask.usecase";
import {
  getAllTasksUseCaseImplementation,
  getTaskByIdUseCaseImplementation,
} from "./getTasks.usecase";
import { updateTaskUseCaseImplementation } from "./updateTask.usecase";

const taskRepository = createTaskRepository(client);
