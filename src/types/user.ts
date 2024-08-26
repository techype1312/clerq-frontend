import { z } from "zod";
import { signInSchema, signUpSchema } from "./schema-embedded";
import { IRole, IStatus } from "./general";
import { IImageFileType } from "./file";
import { IAddress } from "./address";
import { Dispatch, SetStateAction } from "react";

export type userType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;

export interface IUser {
  id: string;
  email: string;
  provider: string;
  firstName: string;
  lastName: string;
  legalFirstName?: string;
  legalLastName?: string;
  phone: string;
  country_code: number;
  role?: IRole;
  ssn?: string;
  dob?: Date;
  photo?: IImageFileType;
  status?: IStatus;
  legal_address?: IAddress;
  mailing_address?: IAddress;
  email_verified?: boolean;
  phone_verified?: boolean;
  tax_residence_country?: string;
  onboarding_completed?: boolean;
}

export interface IUserContext {
  loading: boolean;
  error: string;
  refetchUserData: boolean;
  userData?: IUser;
  setRefetchUserData: Dispatch<SetStateAction<boolean>>;
  refreshUser: () => Promise<false | void>;
  updateUserLocalData: (data: any) => void;
  updateUserPhoto: (logo: IImageFileType) => Promise<false | void>;
  removeUserPhoto: () => Promise<false | void>;
  updateUserData: (
    values: Partial<IUser>,
    onboarding?: boolean
  ) => Promise<false | void>;
}
