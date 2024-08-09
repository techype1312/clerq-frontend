import { z } from "zod";
import { Country } from "country-state-city";
import validator from "validator";

export const signUpSchema = z
  .object({
    name: z.object({
      first_name: z.string({
        required_error: "First Name is required",
      }),
      last_name: z.string({
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
    required_error: "phone number is required",
  }),
});
const countryList = Country.getAllCountries().map((c) => c.name);
const restOfCountryList = countryList.filter((c) => c !== countryList[0]);

const customErrorMap: z.ZodErrorMap = (issue, ctx) => ({
  message: "Country is required",
});

export const step1Schema = z.object({
  name: z.object({
    firstName: z.string({
      required_error: "First Name is required",
    }),
    lastName: z.string({
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
        value < new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      {
        message: "Date of birth cannot be less than 16 years ago",
      }
    ),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  phone: z.string(),
  address: z.object({
    country: z.enum(["United States (US)"], {
      errorMap: customErrorMap,
    }),
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
    postal_code: z.number({
      required_error: "Zip code is required",
    }),
  }).optional(),
  is_mailing_address_same: z.boolean().optional(),
  mailing_address: z.object({
    country: z.enum(["United States (US)"], {
      errorMap: customErrorMap,
    }),
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
    postal_code: z.number({
      required_error: "Zip code is required",
    }),
  }).optional(),
  address_id: z.string().optional(),
  mailing_address_id: z.string().optional(),
  // lat: z.number(),
  // lng: z.number(),
  // lat1: z.number(),
  // lng1: z.number(),
  country_of_tax_residence: z.enum(["United States (US)"], {
    errorMap: customErrorMap,
  }),
  company: z.enum(["Yes", "No"]).optional(),
});

export type Step1Schema = z.infer<typeof step1Schema>;
export type Address = Step1Schema["address"];

export const step2Schema = z.object({
  company_name: z.string({
    required_error: "Company Name is required",
  }),
  company_email: z
    .string({
      required_error: "Company Email is required",
    })
    .email(),
  phone: z.string(),
  //Bug: For modals the variable needs to be named without snake_case (haven't tested camelCase) i.e. company_address is invalid and address is valid
  address: z.object({
    country: z.enum(["United States (US)"], {
      errorMap: customErrorMap,
    }),
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
    postal_code: z.number({
      required_error: "Zip code is required",
    }),
  }).optional(),
  is_mailing_address_same: z.boolean().optional(),
  mailing_address: z.object({
    country: z.enum(["United States (US)"], {
      errorMap: customErrorMap,
    }),
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
    postal_code: z.number({
      required_error: "Zip code is required",
    }),
  }).optional(),
  address_id: z.string().optional(),
  mailing_address_id: z.string().optional(),
  ein: z.string({
    required_error: "EIN is required",
  }),
  country_of_tax_residence: z.enum(["United States (US)"], {
    errorMap: customErrorMap,
  }),
  federal_tax_classification: z.enum([
    "Individual/sole proprietor or single-member LLC",
    "C Corporation",
    "S Corporation",
    "Partnership",
    "Trust/estate",
    "Limited liability company (if applicable, provide the classification)",
    "Other (see instructions)",
  ]),
  // exemptions: z.enum([
  //   "Exempt payee code (if any)",
  //   "Exemption from FATCA reporting code (if any)",
  // ]),
});

export type Step2Schema = z.infer<typeof step2Schema>;

export const step5Schema = z.object({
  management_company: z.string().array().optional(),
  agency: z.string().array().optional(),
  legal: z.string().array().optional(),
});

export const inviteUserSchema = z.object({
  name: z.object({
    first_name: z.string({
      required_error: "First Name is required",
    }),
    last_name: z.string({
      required_error: "Last Name is required",
    }),
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  role: z.enum(
    ["Owner", "Admin", "Accountant", "CPA", "Lawyer", "Agency", "Management"],
    {
      errorMap: customErrorMap,
    }
  ),
});
