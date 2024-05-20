import { buildTask, Task, TaskDto } from "../../domain/entities/task";
import { TaskRepository } from "../../infrastructure/repositories/task.repository";

export function createTaskUseCaseImplementation(
  repository: TaskRepository,
): (taskDto: TaskDto) => Promise<Task> {
  return async (taskDto: TaskDto) => {
    const task: Task = await buildTask(taskDto);
    //service calls

    //repository calls
    const savedTask = await repository.add(task);
    return await savedTask;
  };
}
