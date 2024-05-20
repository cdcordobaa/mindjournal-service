import { Task } from "../../domain/entities/task";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export const getAllTasksUseCaseImplementation = (
  repository: TaskRepository,
): (() => Promise<Task[]>) => {
  return async (): Promise<Task[]> => {
    return repository.getAll();
  };
};

export const getTaskByIdUseCaseImplementation = (
  repository: TaskRepository,
): ((taskId: string) => Promise<Task | null>) => {
  return async (taskId: string): Promise<Task | null> => {
    return repository.getById(taskId);
  };
};