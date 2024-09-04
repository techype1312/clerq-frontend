import React, { useEffect, useState } from "react";
import startCase from "lodash/startCase";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { permissions } from "@/components/common/Permissions";
import { ErrorProps } from "@/types/general";
import { allowedRoles } from "@/utils/constants";
import TeamApis from "@/actions/data/team.data";
import Avatar from "../Avatar";
import { isDemoEnv } from "../../../../../config";
import Permission from "@/components/common/Permissions";
import AutoForm from "@/components/ui/auto-form";
import { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";
import { editUserSchema, permissionsSchema } from "@/types/schema-embedded";
import { DefaultRolePermissions } from "@/utils/constants/roles";
import { PermissionType } from "@/types/permissions";
import { routesPermissionSetter } from "@/utils/utils";

const EditMemberDialog = ({
  row,
  onUpdate,
}: {
  row: any;
  onUpdate?: (ucrmId: string, status: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [roleId, setRoleId] = useState(String(row.role));
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<PermissionType>(
    row.permissions
  );
  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onUpdateSucess = (res: any) => {
    onUpdate &&
      onUpdate(res.id, {
        role: res.role,
        permissions: res.permissions,
      });
    setOpen(false);
    setLoading(false);
  };

  const updateRolePermissions = () => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    let routeSortedPermissions = routesPermissionSetter(permissions);
    return TeamApis.updateTeamMember(row.id, {
      role: { id: roleId },
      permissions: routeSortedPermissions,
    }).then(onUpdateSucess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild disabled={loading}>
        <Button
          variant="secondary"
          className="gap-2 rounded-none px-4 py-1 h-10 justify-start bg-transparent hover:bg-blue-50 text-blue-600"
          style={{
            fontSize: "12px",
            lineHeight: "12px",
          }}
        >
          <SymbolIcon icon="edit" size={20} />
          {`Edit`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-md:min-w-full h-screen md:h-auto overflow-auto">
        <DialogHeader className="h-fit mt-auto">
          <div className="flex flex-row max-sm:flex-col gap-4 w-full items-start justify-between min-w-64 mt-6 text-base font-normal text-left text-label">
            <div className="flex text-label text-base gap-4 items-center min-w-52">
              <Avatar firstName={row.firstName} lastName={row.lastName} />
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-normal text-[#363644]">
                  {`${row.firstName} ${row.lastName}`}
                </span>
                <span
                  style={{
                    color: "#70707d",
                    fontSize: "13px",
                    letterSpacing: ".1px",
                    lineHeight: "20px",
                  }}
                >
                  {row.email}
                </span>
              </div>
            </div>
            <Select
              defaultValue={roleId}
              onValueChange={(e) => {
                setRoleId(e);
                const roleName = allowedRoles.find(
                  (role) => role.id === Number(e)
                )?.name;
                console.log("here");
                setPermissions(
                  DefaultRolePermissions[
                    roleName?.toLowerCase() as keyof typeof DefaultRolePermissions
                  ]
                );
              }}
            >
              <SelectTrigger className="flex h-10 text-black min-w-36 w-fit max-sm:w-full">
                <SelectValue placeholder="select value" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map((value, index) => (
                  <SelectItem
                    value={String(value.id) ?? "undefined"}
                    key={String(value.id) + index}
                    disabled={value.id === 3}
                  >
                    {startCase(value.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogDescription className="h-fit">
          {/* <Permissions /> */}
          <AutoForm
            formSchema={editUserSchema}
            fieldConfig={{
              show_permissions: {
                inputProps: {
                  accordionSingle: true,
                },
                finance_show: {
                  label: "Finance",

                  fieldType: ({
                    field,
                    fieldProps,
                  }: AutoFormInputComponentProps) => {
                    return (
                      <Permission
                        permissionData={{
                          value: "finance",
                          label: "Finance",
                          description: "Can view and access finance",
                          data: Object.keys(
                            permissionsSchema.shape.finance.shape
                          ),
                        }}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        field={field}
                        fieldProps={fieldProps}
                      />
                    );
                  },
                },
                documents_show: {
                  label: "Documents",
                  fieldType: ({
                    field,
                    fieldProps,
                  }: AutoFormInputComponentProps) => {
                    return (
                      <Permission
                        permissionData={{
                          value: "documents",
                          label: "Documents",
                          description: "Can view and access documents",
                          data: Object.keys(
                            permissionsSchema.shape.documents.shape
                          ),
                        }}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        field={field}
                        fieldProps={fieldProps}
                      />
                    );
                  },
                },
                reports_show: {
                  label: "Reports",
                  fieldType: ({
                    field,
                    fieldProps,
                  }: AutoFormInputComponentProps) => {
                    return (
                      <Permission
                        permissionData={{
                          value: "reports",
                          label: "Reports",
                          description: "Can view and access reports",
                          data: Object.keys(
                            permissionsSchema.shape.reports.shape
                          ),
                        }}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        field={field}
                        fieldProps={fieldProps}
                      />
                    );
                  },
                },
                company_settings_show: {
                  label: "Company Settings",
                  fieldType: ({
                    field,
                    fieldProps,
                  }: AutoFormInputComponentProps) => {
                    return (
                      <Permission
                        permissionData={{
                          value: "companySettings",
                          label: "Company Settings",
                          description: "Can view and access company settings",
                          data: Object.keys(
                            permissionsSchema.shape.companySettings.shape
                          ),
                        }}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        field={field}
                        fieldProps={fieldProps}
                      />
                    );
                  },
                },
                teams_show: {
                  label: "Teams",
                  fieldType: ({
                    field,
                    fieldProps,
                  }: AutoFormInputComponentProps) => {
                    return (
                      <Permission
                        permissionData={{
                          value: "teams",
                          label: "Teams",
                          description: "Can view and access teams",
                          data: Object.keys(
                            permissionsSchema.shape.teams.shape
                          ),
                        }}
                        permissions={permissions}
                        setPermissions={setPermissions}
                        field={field}
                        fieldProps={fieldProps}
                      />
                    );
                  },
                },
              },
              permissions: {
                routes: {
                  inputProps: {
                    showObject: false,
                  },
                },
                finance: {
                  inputProps: {
                    showObject: false,
                  },
                },
                documents: {
                  inputProps: {
                    showObject: false,
                  },
                },
                reports: {
                  inputProps: {
                    showObject: false,
                  },
                },
                companySettings: {
                  inputProps: {
                    showObject: false,
                  },
                },
                teams: {
                  inputProps: {
                    showObject: false,
                  },
                },
              },
            }}
            values={{
              show_permissions: {
                finance_show: permissions.finance
                  ? permissions.finance.manageBankAccounts ||
                    permissions.finance.manageTransactions ||
                    permissions.finance.viewBookKeepings ||
                    permissions.finance.viewFinance
                  : false,
                documents_show:
                  permissions.documents.downloadDocument ||
                  permissions.documents.uploadDocument ||
                  permissions.documents.generateDocument ||
                  permissions.documents.shareDocument,
                reports_show:
                  permissions.reports.downloadFinanceReports ||
                  permissions.reports.downloadSheetReports ||
                  permissions.reports.downloadStatementReports ||
                  permissions.reports.downloadTransactionReports,
                company_settings_show:
                  permissions.companySettings.bookMeeting ||
                  permissions.companySettings.chatSupport ||
                  permissions.companySettings.updateControls ||
                  permissions.companySettings.manageCompanyProfile,
                teams_show:
                  permissions.teams.manageInvite ||
                  permissions.teams.manageTeam,
              },
              permissions: permissions,
            }}
            className="flex flex-col gap-4 max-w-lg mx-auto"
            zodItemClass="flex flex-col md:flex-row grow gap-4 space-y-0 w-full"
            zodItemClassWithoutName="flex flex-col grow gap-4 space-y-0 w-full"
            withSubmitButton={false}
            submitButtonText="Get started"
            submitButtonClass="background-primary"
            labelClass="text-primary"
            onValuesChange={(values) => {}}
          ></AutoForm>
          <div className="mt-4 ml-auto flex gap-2 justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
                disabled={loading}
              >
                Close
              </Button>
            </DialogClose>
            {!isDemoEnv() && (
              <Button
                type="button"
                className="background-primary px-8 rounded-full h-10"
                onClick={updateRolePermissions}
                disabled={loading}
              >
                {loading && <Loader2Icon className="animate-spin" size={20} />}
                Update
              </Button>
            )}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
