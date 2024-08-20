import { ICompany } from "./company";
import { IRole, IStatus } from "./general";
import { IUser } from "./user";

export interface IUcrm {
  id: string;
  role: IRole;
  company: ICompany;
  user: IUser;
  status: IStatus;
}

export interface IUCRMContext {
  loading: boolean;
  error: string;
  myCompanyMappings: IUcrm[];
  currentUcrm?: IUcrm;
  switchCompany: (ucrmId: IUcrm['id']) => Promise<void>;
}
