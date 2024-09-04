import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import find from "lodash/find";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import Permission from "@/components/common/Permissions";
import AutoForm from "@/components/ui/auto-form";
import {
  inviteUserSchema,
  permissionsSchema,
  routesSchema,
} from "@/types/schema-embedded";
import { ErrorProps } from "@/types/general";
import { allowedRoles } from "@/utils/constants";
import InviteTeamApis from "@/actions/data/invite.data";
import { isDemoEnv } from "../../../../../config";
import { AutoFormInputComponentProps } from "@/components/ui/auto-form/types";
import { PermissionType } from "@/types/permissions";
import { DefaultRolePermissions } from "@/utils/constants/roles";
import { routesPermissionSetter } from "@/utils/utils";

const InviteNewMemberDialog = ({
  onAddSuccess,
}: {
  onAddSuccess: (data: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(allowedRoles[0].name);
  const [permissions, setPermissions] = useState<PermissionType>(
    DefaultRolePermissions[
      allowedRoles[0].name.toLowerCase() as keyof typeof DefaultRolePermissions
    ]
  );

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onSuccess = (res: any) => {
    setLoading(false);
    onAddSuccess(res);
    setOpen(false);
    toast.success(`Invite Sent`, {
      position: "bottom-center",
      hideProgressBar: true,
    });
  };

  const sendNewInvite = (values: Record<string, any>) => {
    if (loading) return false;
    setLoading(true);
    setServerError("");
    const selectedRoleId = find(allowedRoles, { name: values.role })?.id;
    let routeSortedPermissions = routesPermissionSetter(permissions);
    return InviteTeamApis.createInvite({
      email: values.email,
      firstName: values.name.firstName,
      lastName: values.name.lastName,
      role: {
        id: selectedRoleId,
      },
      permissions: routeSortedPermissions,
    }).then(onSuccess, onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    setPermissions(
      DefaultRolePermissions[
        role.toLowerCase() as keyof typeof DefaultRolePermissions
      ]
    );
  }, [role]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="rounded-full gap-2 px-4 py-2 h-8 hover:bg-gray-200"
        >
          <SymbolIcon icon="person_add" color="#535460" size={22} />
          Invite a Team member
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg h-screen md:h-auto overflow-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="h-fit mt-auto">
          <DialogTitle className="text-left md:text-center h-fit">{`Add member`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col w-full items-center min-w-64 mt-6 mb-4 overflow-scroll h-screen md:h-[80vh]">
            <AutoForm
              formSchema={inviteUserSchema(allowedRoles.map((r) => r.name))}
              fieldConfig={{
                show_permissions: {
                  inputProps: {
                    accordionSingle: true,
                  },
                  // routes_show: {
                  //   label: "Routes",
                  //   description: "Can view and access routes",
                  //   fieldType: ({
                  //     field,
                  //     fieldProps,
                  //   }: AutoFormInputComponentProps) => {
                  //     return (
                  //       <Permission
                  //         permissionData={{
                  //           value: "routes",
                  //           label: "Routes",
                  //           data: Object.keys(routesSchema.shape),
                  //         }}
                  //         permissions={permissions}
                  //         setPermissions={setPermissions}
                  //         field={field}
                  //         fieldProps={fieldProps}
                  //       />
                  //     );
                  //   },
                  // },
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
                role: role,
                show_permissions: {
                  finance_show: permissions.finance ?
                    permissions.finance.manageBankAccounts ||
                    permissions.finance.manageTransactions ||
                    permissions.finance.viewBookKeepings ||
                    permissions.finance.viewFinance : false,
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
              defaultValues={{
                role: allowedRoles[0].name,
              }}
              className="flex flex-col gap-4 max-w-lg mx-auto"
              zodItemClass="flex flex-col md:flex-row grow gap-4 space-y-0 w-full"
              zodItemClassWithoutName="flex flex-col grow gap-4 space-y-0 w-full"
              withSubmitButton={false}
              submitButtonText="Get started"
              submitButtonClass="background-primary"
              labelClass="text-primary"
              onValuesChange={(values) => {
                if (values.role) {
                  setRole(values.role);
                }
              }}
              onSubmit={sendNewInvite}
            >
              <div className="ml-auto h-10 flex flex-row gap-2 mt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="background-muted text-label hover:!background-muted h-10 px-8 rounded-full"
                    disabled={loading}
                  >
                    {"Close"}
                  </Button>
                </DialogClose>
                {!isDemoEnv() && (
                  <Button
                    type="submit"
                    className="background-primary px-8 rounded-full h-10"
                    disabled={loading}
                  >
                    {loading && (
                      <Loader2Icon className="animate-spin" size={20} />
                    )}
                    {"Send Invite"}
                  </Button>
                )}
              </div>
            </AutoForm>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default InviteNewMemberDialog;
