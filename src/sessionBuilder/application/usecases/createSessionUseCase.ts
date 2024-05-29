import { SessionService } from "../../domain/services/sessionService";
import { mapToSessionOutput } from "../../infrastructure/utils/mappers/sessionMapper";
import { Dependencies } from "../../interfaces/Dependencies";
import { CreateSessionInput } from "../../interfaces/SessionInput";

/**
 * @description Use case to handle creating sessions.
 */
export async function CreateSessionUseCase(
  dependencies: Dependencies,
  sessionData: CreateSessionInput,
): Promise<void> {
  const sessionService = new SessionService(dependencies);
  return sessionService.createSession(sessionData);
}
