import { randomUUID } from 'crypto';
import {
  AttributeValue,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput
} from '@aws-sdk/client-dynamodb';

import { Repository } from '../../interfaces/Repository';
import { SlotDTO, SlotId } from '../../interfaces/Slot';
import { DynamoItem, DynamoItems } from '../../interfaces/DynamoDb';
import { Event, EventDetail } from '../../interfaces/Event';

import { MissingEnvVarsError } from '../../errors/MissingEnvVarsError';

import { getCleanedItems } from '../utils/getCleanedItems';

import { testData } from "../../../utils/testData";
import { SessionDTO, SessionId } from "../../interfaces/Session";

/**
 * @description Factory function to create a DynamoDB repository.
 */
export function createDynamoDbRepository(): DynamoDbRepository {
  return new DynamoDbRepository();
}

/**
 * @description Concrete implementation of DynamoDB repository.
 * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-table-read-write.html
 */
class DynamoDbRepository implements Repository {
  docClient: DynamoDBClient;
  tableName: string;
  region: string;

  constructor() {
    this.region = process.env.REGION || "";
    this.tableName = process.env.TABLE_NAME || "";

    if (!this.region || !this.tableName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: "REGION", value: process.env.REGION },
          { key: "TABLE_NAME", value: process.env.TABLE_NAME },
        ]),
      );

    this.docClient = new DynamoDBClient({ region: this.region });
  }

  /**
   * @description Add (append) an Event in the source database.
   */
  public async addEvent(event: Event): Promise<void> {
    const eventData = event.get();
    const detail: EventDetail = JSON.parse(eventData["Detail"]);
    const data =
      typeof detail["data"] === "string"
        ? JSON.parse(detail["data"])
        : detail["data"];

    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: "EVENT" },
        id: { S: randomUUID() },
        eventTime: { S: detail["metadata"]["timestamp"] },
        eventType: { S: data["event"] },
        event: { S: JSON.stringify(eventData) },
      },
    };

    if (process.env.NODE_ENV !== "test")
      await this.docClient.send(new PutItemCommand(command));
  }

  public async loadSession(sessionId: SessionId): Promise<SessionDTO> {
    const command = {
      TableName: this.tableName,
      KeyConditionExpression: "itemType = :itemType AND id = :id",
      ExpressionAttributeValues: {
        ":itemType": { S: "SESSION" },
        ":id": { S: sessionId },
      },
      ProjectionExpression: "id, sessionData, createdAt, updatedAt",
    };

    const data: QueryCommandOutput | DynamoItems =
      process.env.NODE_ENV === "test"
        ? testData
        : await this.docClient.send(new QueryCommand(command));
    const items =
      (data.Items?.map(
        (item: Record<string, AttributeValue>) => item,
      ) as DynamoItem[]) || [];

    return getCleanedItems(items)[0] as unknown as SessionDTO;
  }

  public async updateSession(session: SessionDTO): Promise<void> {
    const { sessionId, createdAt, updatedAt } = session;

    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: "SESSION" },
        id: { S: sessionId },
        createdAt: { S: createdAt },
        updatedAt: { S: updatedAt },
      },
    };

    if (process.env.NODE_ENV !== "test")
      await this.docClient.send(new PutItemCommand(command));
  }

  public async createSession(session: SessionDTO): Promise<void> {
    const { sessionId, createdAt, updatedAt } = session;

    const command = {
      TableName: this.tableName,
      Item: {
        itemType: { S: "SESSION" },
        id: { S: sessionId || randomUUID() },
        createdAt: { S: createdAt },
        updatedAt: { S: updatedAt },
      },
    };

    if (process.env.NODE_ENV !== "test")
      await this.docClient.send(new PutItemCommand(command));
  }
}
