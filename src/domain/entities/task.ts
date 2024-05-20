import { randomUUID } from "crypto";

export interface TaskDto {
  id?: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  boardId: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Done";
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  userId: string;
}

export function buildTask({
  id,
  title,
  description = "",
  status,
  createdAt = new Date(),
  updatedAt = new Date(),
  userId,
  boardId,
}: TaskDto): Task {
  if (!title) throw new Error("Title is required");

  return Object.freeze({
    id: id ?? randomUUID(),
    boardId: boardId ?? "default-board",
    title,
    description,
    status,
    createdAt,
    updatedAt,
    userId,
  });
}
