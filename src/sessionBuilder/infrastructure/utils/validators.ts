import { SessionCreationInput } from "../adapters/handlers/createSession";
import * as yup from "yup";

const sessionCreationInputSchema = yup.object({
  userId: yup.string().required(),
  emotionalState: yup
    .object({
      details: yup.string().required(),
    })
    .required(),
  settings: yup
    .object({
      language: yup.string().required(),
      soundscape: yup.string().required(),
      narrator: yup.string().required(),
      duration: yup.string().required(),
    })
    .required(),
  files: yup.object().required(),
});

export const parseAndValidateCreateSessionInput = async (
  body: string | null,
): Promise<SessionCreationInput> => {
  if (!body) throw new Error("Request body is empty");
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
  try {
    await sessionCreationInputSchema.validate(parsedBody, { strict: true });
  } catch (validationError) {
    throw new Error(`Validation error: ${validationError}`);
  }
  return parsedBody as SessionCreationInput;
};
