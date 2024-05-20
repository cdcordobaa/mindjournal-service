import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export const deleteTaskUseCaseImplementation = (
  repository: TaskRepository,
): ((taskId: string) => Promise<void>) => {
  return async (taskId: string): Promise<void> => {
    await repository.delete(taskId);
  };
};
