import { success } from "../../utils/responses";

export const handler = async (event: any): Promise<Record<string, any>> => {
  return success({
    message: "Function executed successfully!",
    input: event,
  });
};
