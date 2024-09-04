//This component will be used to display the data on Income statement and Balance sheet pages
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormItem } from "../ui/form";
import { Button } from "../ui/button";
import { beautifyObjectName } from "../ui/auto-form/utils";

export const permissions = [
  {
    label: "Manage Users",
    value: "manage_users",
    data: [
      { label: "Recommended for:", points: ["Senior Employees", "HR Roles"] },
      {
        label: "Able to:",
        points: [
          "View all bank accounts",
          "Add transaction notes and attachments",
          "Download docs and statements",
        ],
      },
    ],
    defaultSelected: true,
    showFooter: false,
    isCollapsible: true,
  },
  {
    label: "Access to Bank Accounts",
    value: "manage_bank_accounts",
    data: [
      { label: "Recommended for:", points: ["Senior Employees", "HR Roles"] },
      {
        label: "Able to:",
        points: [
          "View all bank accounts",
          "Add transaction notes and attachments Add transaction notes and attachments Add transaction notes and attachments Add transaction notes and attachments",
          "Download docs and statements",
        ],
      },
    ],
    defaultSelected: false,
    showFooter: false,
    isCollapsible: true,
  },
  {
    label: "Upload and View Documents",
    value: "manage_documents",
    data: [
      { label: "Recommended for:", points: ["Senior Employees", "HR Roles"] },
      {
        label: "Able to:",
        points: [
          "View all bank accounts",
          "Add transaction notes and attachments",
          "Download docs and statements",
        ],
      },
    ],
    defaultSelected: false,
    showFooter: false,
    isCollapsible: true,
  },
];

const Permission = ({
  field,
  fieldProps,
  permissionData,
  permissions,
  setPermissions,
}: {
  permissionData: any;
  field: any;
  fieldProps?: any;
  permissions?: any;
  setPermissions?: any;
}) => {
  return (
    <FormItem className="border-b">
      <AccordionItem
        className="flex flex-col w-full"
        value={permissionData.value}
        key={`prs_${permissionData.value}`}
      >
        <FormControl>
          <div className="flex flex-row gap-2 items-center flex-1 w-full">
            <AccordionTrigger className="p-2">
              <div className="flex flex-col gap-2 items-start flex-1">
                <h3 className="font-medium">{permissionData.label}</h3>
                <p>{permissionData.description}</p>
              </div>
            <Button
              onClick={() => {
                const newPermissions = { ...permissions };
                permissionData.data.forEach((item: any) => {
                  newPermissions[permissionData.value][item] = !field.value;
                });
                console.log(newPermissions)
                setPermissions(newPermissions);
                field.onChange(!field.value);
              }}
              className="text-sm ml-auto"
              variant={'ghost'}
            >
              {field.value ? "Unselect All" : "Select All"}
            </Button>
            </AccordionTrigger>
          </div>
        </FormControl>
        <AccordionContent className="ml-6">
          {permissions &&
            permissionData?.data?.map((item: any, idx: number) => {
              return (
                <div
                  key={`item_${item}`}
                  className="mb-4 flex gap-2 text-[#9D9DA7]"
                >
                  <Checkbox
                    checked={permissions && permissions[permissionData?.value] && permissions[permissionData?.value][item] && permissions[permissionData?.value][item]}
                    onCheckedChange={() => {
                      setPermissions({
                        ...permissions,
                        [permissionData.value]: {
                          ...permissions[permissionData.value],
                          [item]: !permissions[permissionData.value][item],
                        },
                      });
                    }}
                  />
                  <p className="font-medium">{beautifyObjectName(item)}</p>
                </div>
              );
            })}
        </AccordionContent>
      </AccordionItem>
    </FormItem>
  );
};

export default Permission;
