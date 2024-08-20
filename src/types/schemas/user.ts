import { addressSchema } from "@/types/schema-embedded";
import { z } from "zod";

const UserUpdateSchema = {
  preferredName: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  legalName: z.object({
    legalFirstName: z.string(),
    legalLastName: z.string(),
  }),
  dob: z.object({
    dob: z
      .date()
      .min(new Date("1900-01-01"), {
        message: "A valid date of birth is required",
      })
      .refine(
        (value) =>
          value <
          new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        {
          message: "Date of birth cannot be less than 18 years ago",
        }
      ),
  }),
  phone: z.object({ phone: z.string(),country_code: z.number() }),
  address: addressSchema,
};

export { UserUpdateSchema };
