import { toast } from "react-toastify";
import { z } from "zod";

const allSpecialChars = /[\W_]/;

export const signUpSchema = z
  .object({
    firstName: z.string({
      required_error: "First Name is required",
    }),
    lastName: z.string({
      required_error: "Last Name is required",
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
  })
  .superRefine(({ password }, checkPassComplexity) => {
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
      console.log(passwordCheck, containsNumber(password), containsSpecialChar(password), containsLowercase(password), containsUppercase(password)) ;
    if (!passwordCheck || passwordLength < 8)
      checkPassComplexity.addIssue({
        code: "custom",
        message: "password does not meet complexity requirements",
      });
  });


export const signInSchema = z.object({
  usernameOrEmail: z.string({
    required_error: "Username or Email is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});