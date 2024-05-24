import { TaskDto } from "../domain/entities/task";
import * as yup from "yup";

const taskDtoSchema = yup.object({
  id: yup.string().optional(),
  title: yup.string().required(),
  description: yup.string().optional(),
  status: yup
    .mixed<"Todo" | "In Progress" | "Done">()
    .oneOf(["Todo", "In Progress", "Done"])
    .required(),
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
  boardId: yup.string().optional(),
  userId: yup.string().required(),
});

export const parseAndValidateTaskDto = async (
  body: string | null,
): Promise<TaskDto> => {
  if (!body) throw new Error("Request body is empty");
  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON format");
  }
  try {
    await taskDtoSchema.validate(parsedBody, { strict: true });
  } catch (validationError) {
    throw new Error(`Validation error: ${validationError}`);
  }
  return parsedBody as TaskDto;
};
