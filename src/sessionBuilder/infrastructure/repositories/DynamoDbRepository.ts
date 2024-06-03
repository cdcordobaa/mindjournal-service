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

    this.docClient = new DynamoDBClient({
      region: this.region,
      credentials: {
        accessKeyId: "ASIA5FTZBMSSCSGW4RC4",
        secretAccessKey: "HClGzxpnENzUXgnIUHcrNp8pPQtA9XEs/LQjgii6",
        sessionToken:
          "IQoJb3JpZ2luX2VjEK7//////////wEaCXVzLWVhc3QtMSJGMEQCICB7yU0q8eRg0qQO2piexR3Rd8GxK7Mx7nbPK0+b8MR4AiAQ7oiuwrmiW8lTtvAP9fFZPUwkC3N3P7QK+pa7wwYXQirxAgg3EAAaDDkwNTQxODIwNDMyNCIMCWUtei2+2rWzOPhSKs4CseRMzbkcfneZcP7/f+guP+YfjO0UFX7WzWl3ljyLaAFCEbQENu+weEgGf0TSSIPhOZYevC4hTqZykb5sZ6R8PyekIXB9/CbUWl1hnlPAUFfdNtSdmpai0Qr/T23QkZnjw+J8vS1WKIQ9xRqd66OeGnlVaWwF3lEkaAUMGgoEVtIs5SlMwyrZe5FynJ3nHv9HNTEPFTQZAzhSukSEOHbCJsUS1WgXfTn8E0/9Y7C7Of6HiFcEqElncNyysgxQJOMJG53QAQxuuXUX+SClu/Z6iNoklzgtYMVxiU9xTSJdjfqWbs6Tu9xysUKgf+RPXhyNTp9a+s6E3CiQImjV1ndSfHtJMHMZLPgUDZamowdPaJokpt8rnmY0UIekCEU3LGxviedOGh5LncJoX5i3xd1p6FTN9MCNm1mx1uYuwowAMJc2hGJUWJZUU6QNpalayTDx6uOyBjqoATvKt36f1WFDYawNpd1p3v7yBTnQmBmuH4W+6iCGfWHV2svt9QPs0KRKLJVpv65h7mOL8FQwQQyaqkqTq1/vMt2LJ23ZPjEiyARpPHaCxWGTbnzkWEJ4BXtoQi1EmyV1h3LpgOBUsNl4k1S01xep/YEUGKrflRL+InoFmNXoaDSR+2SXd5jR6DCndxtonK4BLIZUrWg0JovY87FWKqYQc/534J6BWHMgWw==",
      },
    });

    this.docClient.middlewareStack.add(
      (next, context) => async (args) => {
        console.log(
          `Making request to DynamoDB with args: ${JSON.stringify(args)}`,
        );
        const result = await next(args);
        console.log(
          `Received response from DynamoDB: ${JSON.stringify(result.output)}`,
        );
        return result;
      },
      {
        step: "initialize",
        name: "loggingMiddleware",
        tags: ["LOGGER"],
      },
    );
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

    // Retrieve the session just saved to verify it
    const sessionre = await this.loadSession(sessionId);
    console.log(sessionre);

    return;
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

    // Retrieve the session just saved to verify it
    const sessionre = await this.loadSession(sessionId);
    console.log(sessionre);

    return;
  }
}
