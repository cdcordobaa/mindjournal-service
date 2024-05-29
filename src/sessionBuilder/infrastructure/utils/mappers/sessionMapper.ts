import { Session } from "../../../domain/entities/Session";
import { SessionDTO } from "../../../interfaces/Session";
import { pick } from "lodash";

export const mapToSessionOutput = (sessionDTO: SessionDTO): SessionOutput => {
  return pick(sessionDTO, ["userId", "sessionId"]) as SessionOutput;
};
