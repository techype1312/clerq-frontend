import { Dispatch, SetStateAction } from "react";
import { IAddress } from "./address";
import { IImageFileType } from "./file";
import { IStatus } from "./general";

export interface ICompany {
  id?: string;
  name: string;
  email: string;
  phone: string;
  country_code: number;
  ein: string;
  tax_residence_country: string;
  tax_classification: string;
  status?: IStatus;
  logo?: IImageFileType;
  legal_address?: IAddress;
  mailing_address?: IAddress;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ICompanyContext {
  loading: boolean;
  error: string;
  companyData?: ICompany;
  setCompanyData: Dispatch<SetStateAction<ICompany | undefined>>;
  updateCompanyLogo: (logo: IImageFileType) => Promise<false | void>;
  removeCompanyLogo: () => Promise<false | void>;
  updateCompanyDetails: (values: ICompany) => Promise<false | void>;
}
