import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Task } from "../../domain/entities/task";

const TASK_TABLE = process.env.TASK_TABLE ?? `task-kanban-service-dev-table`;
export interface TaskRepository {
  add(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  getAll(): Promise<Task[]>;
  getById(taskId: string): Promise<Task | null>;
  getAllByBoardId(boardId: string): Promise<Task[]>;
  delete(taskId: string): Promise<void>;
}

export function createTaskRepository(client: DynamoDBClient): TaskRepository {
  return {
    async add(task: Task): Promise<Task> {
      const createdAtISO =
        task.createdAt instanceof Date
          ? task.createdAt.toISOString()
          : new Date().toISOString();
      const updatedAtISO =
        task.updatedAt instanceof Date
          ? task.updatedAt.toISOString()
          : new Date().toISOString();

      const command = new PutItemCommand({
        TableName: TASK_TABLE,
        Item: {
          taskId: { S: task.id },
          title: { S: task.title },
          description: { S: task.description },
          status: { S: task.status },
          createdAt: { S: createdAtISO },
          updatedAt: { S: updatedAtISO },
          userId: { S: task.userId },
          boardId: { S: task.boardId },
        },
      });
      await client.send(command);
      return task;
    },
    async update(task: Task): Promise<Task> {
      const updatedAtISO =
        task.updatedAt instanceof Date
          ? task.updatedAt.toISOString()
          : new Date().toISOString();

      const command = new UpdateItemCommand({
        TableName: TASK_TABLE,
        Key: {
          taskId: { S: task.id },
        },
        UpdateExpression:
          "SET #status = :status, title = :title, description = :description, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":status": { S: task.status },
          ":title": { S: task.title },
          ":description": { S: task.description },
          ":updatedAt": { S: updatedAtISO },
        },
      });
      await client.send(command);
      return task;
    },
    async getAll(): Promise<Task[]> {
      const command = new ScanCommand({
        TableName: TASK_TABLE,
      });
      const response = await client.send(command);
      if (response.Items) {
        return response.Items.map((item) => {
          return {
            id: item.taskId?.S ?? "",
            title: item.title?.S ?? "",
            description: item.description?.S ?? "",
            status: item.status?.S as "Todo" | "In Progress" | "Done",
            createdAt: item.createdAt?.S
              ? new Date(item.createdAt.S)
              : new Date(),
            updatedAt: item.updatedAt?.S
              ? new Date(item.updatedAt.S)
              : new Date(),
            userId: item.userId?.S ?? "",
            boardId: item.boardId?.S ?? "",
          };
        });
      }
      return [];
    },
    async getById(taskId: string): Promise<Task | null> {
      const command = new GetItemCommand({
        TableName: TASK_TABLE,
        Key: {
          taskId: { S: taskId },
        },
      });
      const response = await client.send(command);
      if (response.Item) {
        const item = response.Item;
        return {
          id: item.taskId?.S ?? "",
          title: item.title?.S ?? "",
          description: item.description?.S ?? "",
          status: item.status?.S as "Todo" | "In Progress" | "Done",
          createdAt: item.createdAt?.S
            ? new Date(item.createdAt.S)
            : new Date(),
          updatedAt: item.updatedAt?.S
            ? new Date(item.updatedAt.S)
            : new Date(),
          userId: item.userId?.S ?? "",
          boardId: item.boardId?.S ?? "",
        };
      }
      return null;
    },
    async getAllByBoardId(boardId: string): Promise<Task[]> {
      const command = new ScanCommand({
        TableName: TASK_TABLE,
        FilterExpression: "boardId = :boardId",
        ExpressionAttributeValues: {
          ":boardId": { S: boardId },
        },
      });
      const response = await client.send(command);
      if (response.Items) {
        return response.Items.map((item) => {
          return {
            id: item.taskId?.S ?? "",
            title: item.title?.S ?? "",
            description: item.description?.S ?? "",
            status: item.status?.S as "Todo" | "In Progress" | "Done",
            createdAt: item.createdAt?.S
              ? new Date(item.createdAt.S)
              : new Date(),
            updatedAt: item.updatedAt?.S
              ? new Date(item.updatedAt.S)
              : new Date(),
            userId: item.userId?.S ?? "",
            boardId: item.boardId?.S ?? "",
          };
        });
      }
      return [];
    },
    async delete(taskId: string): Promise<void> {
      const command = new DeleteItemCommand({
        TableName: TASK_TABLE,
        Key: {
          taskId: { S: taskId },
        },
      });
      await client.send(command);
    },
  };
}
