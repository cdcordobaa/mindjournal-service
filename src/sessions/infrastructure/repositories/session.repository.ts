import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  GetItemCommand,
  ScanCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Session } from "../../domain/entities/session";

const SESSION_TABLE = process.env.SESSION_TABLE ?? `session-service-dev-table`;

export interface SessionRepository {
  add(session: Session): Promise<Session>;
  update(session: Session): Promise<Session>;
  getAll(): Promise<Session[]>;
  getById(sessionId: string): Promise<Session | null>;
  delete(sessionId: string): Promise<void>;
}

export const createSessionRepository = (
  client: DynamoDBClient,
): SessionRepository => ({
  add: async (session: Session): Promise<Session> => {
    const command = new PutItemCommand({
      TableName: SESSION_TABLE,
      Item: {
        sessionId: { S: session.id },
        userId: { S: session.userId },
        emotionalState: { S: JSON.stringify(session.emotionalState) },
        settings: { S: JSON.stringify(session.settings) },
        createdAt: { S: session.createdAt.toISOString() },
        updatedAt: { S: session.updatedAt.toISOString() },
      },
    });
    await client.send(command);
    return session;
  },

  update: async (session: Session): Promise<Session> => {
    const command = new UpdateItemCommand({
      TableName: SESSION_TABLE,
      Key: {
        sessionId: { S: session.id },
      },
      UpdateExpression:
        "SET userId = :userId, emotionalState = :emotionalState, settings = :settings, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":userId": { S: session.userId },
        ":emotionalState": { S: JSON.stringify(session.emotionalState) },
        ":settings": { S: JSON.stringify(session.settings) },
        ":updatedAt": { S: session.updatedAt.toISOString() },
      },
    });
    await client.send(command);
    return session;
  },

  getAll: async (): Promise<Session[]> => {
    const command = new ScanCommand({
      TableName: SESSION_TABLE,
    });
    const response = await client.send(command);
    return (
      response.Items?.map((item) => ({
        id: item.sessionId?.S ?? "",
        userId: item.userId?.S ?? "",
        emotionalState: JSON.parse(item.emotionalState?.S ?? "{}"),
        settings: JSON.parse(item.settings?.S ?? "{}"),
        createdAt: new Date(item.createdAt?.S ?? ""),
        updatedAt: new Date(item.updatedAt?.S ?? ""),
      })) ?? []
    );
  },

  getById: async (sessionId: string): Promise<Session | null> => {
    const command = new GetItemCommand({
      TableName: SESSION_TABLE,
      Key: {
        sessionId: { S: sessionId },
      },
    });
    const response = await client.send(command);
    const item = response.Item;
    return item
      ? {
          id: item.sessionId?.S ?? "",
          userId: item.userId?.S ?? "",
          emotionalState: JSON.parse(item.emotionalState?.S ?? "{}"),
          settings: JSON.parse(item.settings?.S ?? "{}"),
          createdAt: new Date(item.createdAt?.S ?? ""),
          updatedAt: new Date(item.updatedAt?.S ?? ""),
        }
      : null;
  },

  delete: async (sessionId: string): Promise<void> => {
    const command = new DeleteItemCommand({
      TableName: SESSION_TABLE,
      Key: {
        sessionId: { S: sessionId },
      },
    });
    await client.send(command);
  },
});