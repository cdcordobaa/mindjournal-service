import { SessionId, SessionStatus } from "./Session";
import { Metadata, MetadataConfigInput } from "./Metadata";

/**
 * @description Represents emittable events.
 */
export interface Event {
  get: () => EventBridgeEvent;
  getAnalyticsVariant: (analyticsBusName: string) => EventBridgeEvent;
}

/**
 * @description Input that is required when calling the `Event` class.
 */
export type EventInput = {
  event: MakeEventInput;
  metadataConfig: MetadataConfigInput;
};

/**
 * @description Input required to create an EventBridgeEvent's `metadata` object.
 */
export type MetadataInput = {
  id: string;
  correlationId: string;
  version: number;
};

/**
 * @description Input needed to make an intermediate Data Transfer Object that contains
 * all required information to vend out a full event.
 */
export type MakeEventInput = {
  /**
   * @description The type of user interaction event that has occurred.
   */
  eventName: UserInteractionEvent | SystemInteractionEvent;
  /**
   * @description The ID of the user that created this session.
   */
  userId: string;
  /**
   * @description The session ID relating to this event.
   */
  sessionId: SessionId;
  /**
   * @description Status of the session.
   */
  sessionStatus: SessionStatus;
  /**
   * @description Optional. The version of the event.
   */
  version?: number;
};

/**
 * @description Complete event input used before `EventCatalog`
 * adds dynamically produced metadata (and any other changes).
 */
export type EventDTO = {
  /**
   * @description The EventBridge bus to publish to.
   */
  eventBusName: string;
  /**
   * @description The EventBridge detail type that this event represents.
   */
  detailType: DetailType;
  /**
   * @description The name of the event.
   */
  eventName: string;
  /**
   * @description Metadata for the event DTO.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description The shape of an input into EventBridge.
 */
export type EventBridgeEvent = {
  /**
   * @description Name of the EventBridge bus.
   */
  EventBusName: string;
  /**
   * @description Source of the event.
   */
  Source: string;
  /**
   * @description The type of event.
   */
  DetailType: DetailType;
  /**
   * @description Input data as string.
   */
  Detail: string;
};

/**
 * @description Events must include data as well as metadata.
 */
export type EventDetail = {
  /**
   * @description Metadata for the event.
   */
  metadata: Metadata;
  /**
   * @description Data for the event.
   */
  data: Data;
};

/**
 * @description Event data can be either an object or a string.
 */
type Data = Record<string, any> | string;

/**
 * @description Represents valid user interaction events.
 */
type UserInteractionEvent =
  | "SESSION_CREATED"
  | "SESSION_STARTED"
  | "SESSION_PAUSED"
  | "SESSION_RESUMED"
  | "SESSION_FINISHED"
  | "SESSION_DELETED";

/**
 * @description Represents valid system interaction events.
 */
type SystemInteractionEvent =
  | "SESSION_BUILDING_STARTED"
  | "SESSION_BUILDING_FINISHED";

/**
 * @description Valid EventBridge detail types.
 */
export type DetailType = UserInteractedDetailType | SystemInteractedDetailType;

/**
 * @description Detail types that come from user interactions.
 */
export type UserInteractedDetailType =
  | "SessionCreated"
  | "SessionStarted"
  | "SessionPaused"
  | "SessionResumed"
  | "SessionFinished"
  | "SessionDeleted";

/**
 * @description Detail types that come from system interactions.
 */
export type SystemInteractedDetailType =
  | "SessionBuildingStarted"
  | "SessionBuildingFinished";
