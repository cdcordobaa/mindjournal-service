import * as yup from "yup";

const sessionInputDtoSchema = yup.object({
  userId: yup.string().required(),
  emotionalState: yup.object({
    description: yup.string().required(),
  }),
  settings: yup.object({
    duration: yup.string().required(),
    narrator: yup.string().required(),
    soundScape: yup.string().required(),
    language: yup.string().required(),
    style: yup.string().required(),
  }),
});

export const parseAndValidateSessionInputDto = async (
  body: string | null,
): Promise<SessionInputDto> => {
  if (!body) throw new Error("Request body is empty");
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
  try {
    await sessionInputDtoSchema.validate(parsedBody, { strict: true });
  } catch (validationError) {
    throw new Error(`Validation error: ${validationError}`);
  }
  return parsedBody as SessionInputDto;
};
