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
  currentUcrm?: IUcrm;
  myCompanyMappings: IUcrm[];
  addNewCompanyMapping: (newUcrm: IUcrm) => void;
  switchCompany: (ucrmId: IUcrm['id']) => Promise<void>;
}
