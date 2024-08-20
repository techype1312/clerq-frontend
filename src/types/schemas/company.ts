import { addressSchema } from "@/types/schema-embedded";
import { z } from "zod";

const CompanyUpdateSchema = {
  companyName: z.object({
    companyName: z.string(),
  }),
  dbaName: z.object({
    dbaName: z.string(),
  }),
  legalName: z.object({
    legalName: z.string(),
  }),
  ein: z.object({
    fedralEin: z.string(),
  }),
  phone: z.object({ phone: z.string() }),
  address: addressSchema,
};

export { CompanyUpdateSchema };