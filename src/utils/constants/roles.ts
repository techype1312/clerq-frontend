import { defaultUserPermissions } from '@/utils/constants/permissions';

export enum RoleEnum {
  'dashboard_admin' = 1,
  'dashboard_contributer' = 2,
  'owner' = 3,
  'admin' = 4,
  'accountant' = 5,
  'cpa' = 6,
  'lawyer' = 7,
  'agency' = 8,
  'manager' = 9,
}

export const DefaultRolePermissions = {
  owner: defaultUserPermissions[RoleEnum.owner],
  admin: defaultUserPermissions[RoleEnum.admin],
  accountant: defaultUserPermissions[RoleEnum.accountant],
  cpa: defaultUserPermissions[RoleEnum.cpa],
  lawyer: defaultUserPermissions[RoleEnum.lawyer],
  agency: defaultUserPermissions[RoleEnum.agency],
  manager: defaultUserPermissions[RoleEnum.manager],
};
