import { MikroLog } from "mikrolog";

// Aggregates/Entities

// Events

// Value objects

// Interfaces
import { SessionDTO, SessionStatus } from "../../interfaces/Session";
import { Repository } from "../../interfaces/Repository";
import { Dependencies } from "../../interfaces/Dependencies";
import { MetadataConfigInput } from "../../interfaces/Metadata";
import { Event } from "../../interfaces/Event";
import { DomainEventPublisherService } from "../../interfaces/DomainEventPublisherService";

// Errors
import { MissingDependenciesError } from "../../errors/MissingDependenciesError";
import { SessionCreatedEvent } from "../events/Event";
import { Session } from "../entities/Session";
import { CreateSessionInput } from "../../interfaces/SessionInput";

/**
 * @description Manages session lifecycle, ensuring all session invariants are maintained.
 */
export class SessionService {
  private readonly repository: Repository;
  private readonly metadataConfig: MetadataConfigInput;
  private readonly domainEventPublisher: DomainEventPublisherService;
  private readonly logger: MikroLog;

  constructor(dependencies: Dependencies) {
    if (!dependencies.repository || !dependencies.domainEventPublisher)
      throw new MissingDependenciesError();
    const { repository, domainEventPublisher, metadataConfig } = dependencies;

    this.repository = repository;
    this.metadataConfig = metadataConfig;
    this.domainEventPublisher = domainEventPublisher;
    this.logger = MikroLog.start();
  }

  private async transact(
    sessionDto: SessionDTO,
    event: Event,
    newStatus: SessionStatus,
  ) {
    await this.repository
      .updateSession(sessionDto)
      .then(() =>
        this.logger.log(
          `Updated status of session '${sessionDto.sessionId}' to '${newStatus}'`,
        ),
      );
    await this.repository.addEvent(event);
    await this.repository.updateSession(sessionDto);
    // await this.domainEventPublisher.publish(event);
  }

  public async createSession(
    input: SessionDTO | CreateSessionInput,
  ): Promise<void> {
    let session: Session;
    if ("sessionId" in input) {
      session = new Session().fromDto(input);
    } else {
      session = new Session(input);
    }

    const { userId, sessionId, sessionStatus } = session.toDto();

    const createSessionEvent = new SessionCreatedEvent({
      event: {
        eventName: "SESSION_CREATED",
        userId,
        sessionId,
        sessionStatus,
      },
      metadataConfig: this.metadataConfig,
    });

    await this.transact(session.toDto(), createSessionEvent, sessionStatus);
  }
}
