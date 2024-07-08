import { z } from "zod";
import { signInSchema, signUpSchema } from "./schema-embedded";

export type userType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;