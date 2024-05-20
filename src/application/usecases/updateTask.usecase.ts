import { buildTask, Task, TaskDto } from "../../domain/entities/task";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export function updateTaskUseCaseImplementation(
  repository: TaskRepository,
): (taskDto: TaskDto) => Promise<Task> {
  return async (taskDto: TaskDto) => {
    const task: Task = await buildTask(taskDto);
    //service calls

    //repository calls
    const updatedTask = await repository.update(task);
    return updatedTask;
  };
}
