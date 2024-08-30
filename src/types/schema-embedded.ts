import { z } from "zod";
import { enabledCountries } from "@/utils/constants";

export const signUpSchema = z
  .object({
    name: z.object({
      firstName: z.string({
        required_error: "First Name is required",
      }),
      lastName: z.string({
        required_error: "Last Name is required",
      }),
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6)
      .max(255),
    confirmPassword: z.string({
      required_error: "Confirm Password is required",
    }),
    phone: z.string({
      required_error: "Phone is required",
    }),
    country_code: z.number({
      required_error: "Country code is required",
    }),
  })
  .superRefine(({ password, confirmPassword }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    const containsNumber = (ch: string) => /[0-9]/.test(ch);
    const passwordLength = password.length;
    const passwordCheck =
      containsUppercase(password) &&
      containsLowercase(password) &&
      containsSpecialChar(password) &&
      containsNumber(password);
    if (!passwordCheck || passwordLength < 8)
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
      });
    if (password !== confirmPassword)
      checkPassComplexity.addIssue({
        code: "custom",
        message: "passwords do not match",
      });
  });

export const signInSchema = z.object({
  email: z.string({
    required_error: "Email is required",
  }),
});
export const signInWithPhoneSchema = z.object({
  phone: z.string({
    required_error: "Phone is required",
  }),
  country_code: z.number({
    required_error: "Country code is required",
  }),
});
// const countryList = Country.getAllCountries().map((c) => c.name);
// const restOfCountryList = countryList.filter((c) => c !== countryList[0]);

const customErrorMap: z.ZodErrorMap = (issue, ctx) => ({
  message: "Country is required",
});

export const step1Schema = z.object({
  name: z.object({
    legalFirstName: z.string({
      required_error: "First Name is required",
    }),
    legalLastName: z.string({
      required_error: "Last Name is required",
    }),
  }),
  date_of_birth: z
    .date()
    .min(new Date("1900-01-01"), {
      message: "A valid date of birth is required",
    })
    .refine(
      (value) =>
        value < new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      {
        message: "Date of birth cannot be less than 18 years ago",
      }
    ),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  phone: z.string({
    required_error: "Phone is required",
  }),
  country_code: z.number({
    required_error: "Country code is required",
  }),
  address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  mailing_address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  address_id: z.string().optional(),
  mailing_address_id: z.string().optional(),
  long: z.number().optional(),
  lat: z.number().optional(),
  long1: z.number().optional(),
  lat1: z.number().optional(),
  tax_residence_country: z.enum([enabledCountries[0], ...enabledCountries], {
    errorMap: customErrorMap,
  }),
  company: z.enum(["Yes", "No"]).optional(),
});

export type Step1Schema = z.infer<typeof step1Schema>;
export type Address = Step1Schema["address"];

export const step2Schema = z.object({
  name: z.string({
    required_error: "Company Name is required",
  }),
  email: z
    .string({
      required_error: "Company Email is required",
    })
    .email(),
  phone: z.string({
    required_error: "Phone is required",
  }),
  country_code: z.number({
    required_error: "Country code is required",
  }),
  //Bug: For modals the variable needs to be named without snake_case (haven't tested camelCase) i.e. company_address is invalid and address is valid
  address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  mailing_address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  address_id: z.string().optional(),
  mailing_address_id: z.string().optional(),
  long: z.number().optional(),
  lat: z.number().optional(),
  long1: z.number().optional(),
  lat1: z.number().optional(),
  ein: z.string({
    required_error: "EIN is required",
  }),
  tax_residence_country: z.enum([enabledCountries[0], ...enabledCountries], {
    errorMap: customErrorMap,
  }),
  tax_classification: z.enum([
    "Individual/sole proprietor or single-member LLC",
    "C Corporation",
    "S Corporation",
    "Partnership",
    "Trust/estate",
    "Limited liability company (if applicable, provide the classification)",
    "Other (see instructions)",
  ]),
});

export type Step2Schema = z.infer<typeof step2Schema>;

export const step5Schema = z.object({
  management_company: z.string().array().optional(),
  agency: z.string().array().optional(),
  legal: z.string().array().optional(),
});

export const inviteUserSchema = (roles: string[]) => {
  return z.object({
    name: z.object({
      firstName: z.string({
        required_error: "First Name is required",
      }),
      lastName: z.string({
        required_error: "Last Name is required",
      }),
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email(),
    role: z.enum([roles[0], ...roles.slice(1)], {
      errorMap: customErrorMap,
    }),
    permissions: permissionsSchema,
    show_permissions: showPermissionsSchema,
  });
};

export const showPermissionsSchema = z.object({
  // routes_show: z.boolean(),
  finance_show: z.boolean(),
  documents_show: z.boolean(),
  reports_show: z.boolean(),
  company_settings_show: z.boolean(),
  teams_show: z.boolean(),
});

export const routesSchema = z.object({
  dashboard: z.boolean(),
  transactions: z.boolean(),
  incomeStatement: z.boolean(),
  balanceSheet: z.boolean(),
  accounts: z.boolean(),
  teams: z.boolean(),
  documents: z.boolean(),
  controls: z.boolean(),
  myProfile: z.boolean(),
  companyProfile: z.boolean(),
  newCompany: z.boolean(),
});

export const financeSchema = z.object({
  viewBookKeepings: z.boolean(),
  viewFinance: z.boolean(),
  manageTransactions: z.boolean(),
  manageBankAccounts: z.boolean(),
});

export const documentsSchema = z.object({
  uploadDocument: z.boolean(),
  generateDocument: z.boolean(),
  downloadDocument: z.boolean(),
  shareDocument: z.boolean(),
});

export const reportsSchema = z.object({
  downloadTransactionReports: z.boolean(),
  downloadSheetReports: z.boolean(),
  downloadStatementReports: z.boolean(),
  downloadFinanceReports: z.boolean(),
});

export const companySettingsSchema = z.object({
  bookMeeting: z.boolean(),
  chatSupport: z.boolean(),
  manageCompanyProfile: z.boolean(),
  updateControls: z.boolean(),
});

export const teamsSchema = z.object({
  manageTeam: z.boolean(),
  manageInvite: z.boolean(),
});

export const permissionsSchema = z.object({
  routes: routesSchema,
  finance: financeSchema,
  documents: documentsSchema,
  reports: reportsSchema,
  companySettings: companySettingsSchema,
  teams: teamsSchema,
});

export const shareDocumentsSchema = z.object({
  recipient_email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
});

export const updateDocumentsSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
});

export const addressSchema = z.object({
  address: z.object({
    address_line_1: z.string({
      required_error: "Street is required",
    }),
    address_line_2: z.string({
      required_error: "City is required",
    }),
    city: z.string({
      required_error: "City is required",
    }),
    state: z.string({
      required_error: "State is required",
    }),
    postal_code: z.string({
      required_error: "Postal code is required",
    }),
    country: z.enum([enabledCountries[0], ...enabledCountries], {
      errorMap: customErrorMap,
    }),
  }),
  address_id: z.string().optional(),
});

export const newCompanySchema = z.object({
  name: z.string({
    required_error: "Company Name is required",
  }),
  email: z
    .string({
      required_error: "Company Email is required",
    })
    .email(),
  phone: z.string({
    required_error: "Phone is required",
  }),
  country_code: z.number({
    required_error: "Country code is required",
  }),
  //Bug: For modals the variable needs to be named without snake_case (haven't tested camelCase) i.e. company_address is invalid and address is valid
  address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  mailing_address: z
    .object({
      address_line_1: z.string({
        required_error: "Street is required",
      }),
      address_line_2: z
        .string({
          required_error: "City is required",
        })
        .optional(),
      city: z.string({
        required_error: "City is required",
      }),
      state: z.string({
        required_error: "State is required",
      }),
      postal_code: z.string({
        required_error: "Postal code is required",
      }),
      country: z.enum([enabledCountries[0], ...enabledCountries], {
        errorMap: customErrorMap,
      }),
    })
    .optional(),
  address_id: z.string().optional(),
  mailing_address_id: z.string().optional(),
  long: z.number().optional(),
  lat: z.number().optional(),
  long1: z.number().optional(),
  lat1: z.number().optional(),
  ein: z.string({
    required_error: "EIN is required",
  }),
  tax_residence_country: z.enum([enabledCountries[0], ...enabledCountries], {
    errorMap: customErrorMap,
  }),
  tax_classification: z.enum([
    "Individual/sole proprietor or single-member LLC",
    "C Corporation",
    "S Corporation",
    "Partnership",
    "Trust/estate",
    "Limited liability company (if applicable, provide the classification)",
    "Other (see instructions)",
  ]),
});

export type NewCompanychema = z.infer<typeof step2Schema>;
