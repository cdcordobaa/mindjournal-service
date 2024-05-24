import { client } from "../../config/dynamoDBClient";
import { createTaskRepository } from "../../infrastructure/repositories/task.repository";
import { createTaskUseCaseImplementation } from "./createTask.usecase";
import { deleteTaskUseCaseImplementation } from "./deleteTask.usecase";
import {
  getAllTasksUseCaseImplementation,
  getTaskByIdUseCaseImplementation,
} from "./getTasks.usecase";
import { updateTaskUseCaseImplementation } from "./updateTask.usecase";

const taskRepository = createTaskRepository(client);

export const createTaskUseCase =
  createTaskUseCaseImplementation(taskRepository);

export const updateTaskUseCase =
  updateTaskUseCaseImplementation(taskRepository);

export const getAllTasksUseCase =
  getAllTasksUseCaseImplementation(taskRepository);

export const getTaskByIdUseCase =
  getTaskByIdUseCaseImplementation(taskRepository);

export const deleteTaskUseCase =
  deleteTaskUseCaseImplementation(taskRepository);
