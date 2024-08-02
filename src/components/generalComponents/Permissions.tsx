//This component will be used to display the data on Income statement and Balance sheet pages
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "../ui/checkbox";

const permissions = [
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

const Permissions = () => {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        {permissions.map((prs) => {
          return (
            <AccordionItem value={prs.value} key={`prs_${prs.value}`}>
              <AccordionTrigger>
                <div className="flex gap-2 items-start">
                  <Checkbox
                    checked={prs.defaultSelected}
                    onCheckedChange={() => {}}
                  />
                  {prs.label}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {prs.data.map((item, idx) => {
                  return (
                    <div
                      key={`item_${prs.value}`}
                      className="mb-4 list-item text-[#9D9DA7]"
                    >
                      <p className="font-medium">{item.label}</p>
                      <ul className="list-disc ml-2">
                        {item.points.map((point, idx) => {
                          return (
                            <li
                              key={`sub_item_${idx}`}
                              className="flex flex-row"
                            >
                              <span className="mr-1">&#x2022;</span>
                              <span>{point}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Permissions;
