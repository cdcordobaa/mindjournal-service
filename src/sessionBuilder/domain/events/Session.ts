import { randomUUID } from "crypto";

import {
  EventInput,
  EventDetail,
  EventBridgeEvent,
  EventDTO,
  MakeEventInput,
  MetadataInput,
} from "../../interfaces/Event";
import { Metadata, MetadataConfigInput } from "../../interfaces/Metadata";

import { getCorrelationId } from "../../infrastructure/utils/userMetadata";

import { MissingMetadataFieldsError } from "../../errors/MissingMetadataFieldsError";
import { NoMatchInEventCatalogError } from "../../errors/NoMatchInEventCatalogError";
import { MissingEnvVarsError } from "../../errors/MissingEnvVarsError";

/**
 * @description Vend a "Event Carried State Transfer" type event with state
 * that can be emitted with an emitter implementation.
 */
abstract class EmittableEvent {
  private readonly event: EventBridgeEvent;
  private readonly eventBusName: string;
  private readonly metadataConfig: MetadataConfigInput;

  constructor(eventInput: EventInput) {
    const { event, metadataConfig } = eventInput;
    this.eventBusName = process.env.DOMAIN_BUS_NAME || "";
    this.metadataConfig = metadataConfig;

    if (!this.eventBusName)
      throw new MissingEnvVarsError(
        JSON.stringify([
          { key: "DOMAIN_BUS_NAME", value: process.env.DOMAIN_BUS_NAME },
        ]),
      );

    const eventDTO = this.toDto(event);
    this.event = this.make(eventDTO);
  }

  /**
   * @description Make an intermediate Data Transfer Object that
   * contains all required information to vend out a full event.
   */
  private toDto(eventInput: MakeEventInput): EventDTO {
    const { eventName, sessionId, sessionStatus } = eventInput;

    const detailType = this.matchDetailType(eventName);
    const timeNow = Date.now();

    return {
      eventBusName: this.eventBusName,
      eventName,
      detailType,
      metadata: {
        ...this.metadataConfig,
        version: eventInput.version || 1,
        id: randomUUID().toString(),
        correlationId: getCorrelationId(),
        timestamp: new Date(timeNow).toISOString(),
        timestampEpoch: `${timeNow}`,
      },
      data: {
        event: eventName,
        sessionId,
        sessionStatus,
      },
    };
  }

  /**
   * @description Produces a fully formed event that can be used with AWS EventBridge.
   */
  private make(eventDto: EventDTO): EventBridgeEvent {
    const { eventBusName, data, metadata, detailType } = eventDto;
    const { version, id, correlationId } = metadata;
    const source = `${metadata.domain?.toLowerCase()}.${metadata.system?.toLowerCase()}.${detailType.toLowerCase()}`;

    const detail: EventDetail = {
      metadata: this.produceMetadata({ version, id, correlationId }),
      data,
    };

    return {
      EventBusName: eventBusName,
      Source: source,
      DetailType: detailType,
      Detail: JSON.stringify(detail),
    };
  }

  /**
   * @description Produce correct metadata format for the event.
   * @note The verbose format is used as we cannot make assumptions
   * on users actually passing in fully formed data.
   */
  private produceMetadata(metadataInput: MetadataInput): Metadata {
    const { version, id, correlationId } = metadataInput;

    if (
      !version ||
      !this.metadataConfig.lifecycleStage ||
      !this.metadataConfig.domain ||
      !this.metadataConfig.system ||
      !this.metadataConfig.service ||
      !this.metadataConfig.team
    )
      throw new MissingMetadataFieldsError(metadataInput);

    const timeNow = Date.now();

    return {
      timestamp: new Date(timeNow).toISOString(),
      timestampEpoch: `${timeNow}`,
      id,
      correlationId,
      version,
      lifecycleStage: this.metadataConfig.lifecycleStage,
      domain: this.metadataConfig.domain,
      system: this.metadataConfig.system,
      service: this.metadataConfig.service,
      team: this.metadataConfig.team,
      hostPlatform: this.metadataConfig.hostPlatform,
      owner: this.metadataConfig.owner,
      region: this.metadataConfig.region,
      jurisdiction: this.metadataConfig.jurisdiction,
      tags: this.metadataConfig.tags,
      dataSensitivity: this.metadataConfig.dataSensitivity,
    };
  }

  /**
   * @description Pick out matching `detail-type` field from event names.
   * @note Should be refactored to regex solution if this grows.
   */
  private matchDetailType(eventName: string) {
    switch (eventName) {
      case "SESSION_CREATED":
        return "SessionCreated" as const;
      default:
        throw new NoMatchInEventCatalogError(eventName);
    }
  }

  /**
   * @description Get event payload.
   */
  public get() {
    return this.event;
  }
}

/**
 * @description An event that represents the `SessionCreated` invariant state.
 */
export class SessionCreatedEvent extends EmittableEvent {
  // Additional methods or properties specific to session creation can be added here
}
