import * as yup from "yup";
import { CreateSessionInput } from "../../../interfaces/SessionInput";

const CreateSessionInputSchema = yup.object({
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
});

export const parseAndValidateSessionCreationInput = async (
  body: string | null,
): Promise<CreateSessionInput> => {
  if (!body) throw new Error("Request body is empty");
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
  try {
    await CreateSessionInputSchema.validate(parsedBody, { strict: true });
  } catch (validationError) {
    throw new Error(`Validation error: ${validationError}`);
  }
  return parsedBody as CreateSessionInput;
};
