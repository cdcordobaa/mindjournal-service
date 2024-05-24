import {
  SessionInput,
  SessionInputDto,
} from "../../domain/entities/sessionInput";

export const createSessionInputUseCaseImplementation = (
  repository: SessionRepository,
): ((sessionInputDto: SessionInputDto) => Promise<Session>) => {
  return async (sessionInputDto: SessionInputDto) => {
    const session: Session = await buildSession(sessionInputDto);

    return repository.add(session);
  };
};
