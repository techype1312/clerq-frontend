import { addressSchema } from "@/types/schema-embedded";
import { z } from "zod";

const company_name_schema = z.object({
  companyName: z.string(),
});

const dba_name_schema = z.object({
  dbaName: z.string(),
});

const legal_name_schema = z.object({
  legalName: z.string(),
});

const ein_schema = z.object({
  fedralEin: z.string(),
});

const phone_schema = z.object({ phone: z.string() });

const CompanyUpdateSchema = {
  company_name: company_name_schema,
  dba_name: dba_name_schema,
  legal_name: legal_name_schema,
  ein: ein_schema,
  phone: phone_schema,
  address: addressSchema,
};

export {
  CompanyUpdateSchema
}