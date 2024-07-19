import { z } from "zod";
import { Country } from "country-state-city";
import validator from "validator";

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
    required_error: "Username or Email is required",
  }),
});
const countryList = Country.getAllCountries().map((c) => c.name);
const restOfCountryList = countryList.filter((c) => c !== countryList[0]);

export const step1Schema = z.object({
  name: z.object({
    first_name: z.string({
      required_error: "First Name is required",
    }),
    last_name: z.string({
      required_error: "Last Name is required",
    }),
  }),
  address: z.string({
    required_error: "Address is required",
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
  phone: z.string().refine(validator.isMobilePhone),
  country_of_tax_residence: z.enum([countryList[0], ...restOfCountryList]),
});

export const step2Schema = z.object({
  company_name: z.string({
    required_error: "Company Name is required",
  }),
  // company_type: z.enum([
  //   "C Corporation",
  //   "S Corporation",
  //   "Partnership",
  //   "Trust/estate",
  //   "Limited liability company (if applicable, provide the classification)",
  //   "Other (see instructions)",
  // ]),
  ein: z.string({
    required_error: "EIN is required",
  }),
  company_email: z.string({
    required_error: "Company Email is required",
  }).email(),
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

export const step4Schema = z.object({
  management_company: z.string().optional(),
  agency: z.string().optional(),
  legal: z.string().optional(),
});