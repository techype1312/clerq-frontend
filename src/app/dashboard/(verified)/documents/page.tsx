"use client";
import React, { Fragment, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import UploadFile from "@/components/generalComponents/UploadFile";

const ColumnItem = ({ label }: { label: string }) => {
  const { toast } = useToast();
  return (
    <div
      className="flex w-full items-center justify-between"
      style={{
        color: "#535460",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "22.4px",
        textAlign: "left",
      }}
    >
      <div className="flex text-label text-base gap-1">
        <SymbolIcon icon="draft" color="#BFBFC5" />
        {label}
      </div>

      <div
        className="flex text-label text-base gap-1"
        style={{
          color: "#70707C",
        }}
      >
        <div className="cursor-pointer hover:text-black">
          <SymbolIcon icon="more_vert" />
        </div>
        <div
          className="cursor-pointer hover:text-black"
          onClick={() => {
            toast({
              title: "W9 2023-2024",
              description: "Email Sent with W-9 Certificate for 2023-2024.",
            });
          }}
        >
          <SymbolIcon icon="mail" />
        </div>
      </div>
    </div>
  );
};

const documentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "receipt_title",
    header: "receipt_title",
    cell: ({ cell }) => {
      return <ColumnItem label={cell.getValue() as string} />;
    },
  },
];

enum DocTypes {
  "form_1099" = "form_1099",
  "tax_payments" = "tax_payments",
  "form_w9" = "form_w9",
  "receipts" = "receipts",
  "templates" = "templates",
  "notices" = "notices",
}

const documentTypes = [
  {
    id: DocTypes.form_1099,
    label: "Form 1099",
    title: "Form 1099",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocTypes.tax_payments,
    label: "Tax Payments",
    title: "Tax Payments",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocTypes.form_w9,
    label: "Form W9",
    title: "W9 Documents",
    description: `Form W-9, also known as the "Hey, We Need Your Tax Info" form, is used by the IRS in the U.S.\nIt's what businesses give to freelancers and other non-employees to get their tax ID number, so they can report how much they paid you.\nIt's like the IRS's way of saying, "We want to make sure you're paying your taxes!"`,
  },
  {
    id: DocTypes.receipts,
    label: "Receipts",
    title: "Receipts",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocTypes.templates,
    label: "Templates",
    title: "Templates",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocTypes.notices,
    label: "Notices",
    title: "Notices",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
];

const rows = [
  {
    receipt_title: "W9_20240414",
    receipt: "oeooe",
  },
  {
    receipt_title: "W9_20230414",
    receipt: "oeooe",
  },
  {
    receipt_title: "W9_20230414",
    receipt: "oeooe",
  },
  {
    receipt_title: "W9_20220414",
    receipt: "oeooe",
  },
];

const Page = () => {
  const [currentType, setCurrentType] = useState<string>(DocTypes.form_w9);
  const [showUpload, setShowUpload] = useState<boolean>(true);
  const selectedDocDetsils = documentTypes.find((dt) => dt.id === currentType);

  const onDoctypeClick = (type: string) => {
    setCurrentType(type);
    setShowUpload(false);
  };

  const toggleUploadSection = () => {
    setShowUpload(!showUpload);
  };

  return (
    <div className="flex gap-24 flex-row">
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "500",
            lineHeight: "28.8px",
            textAlign: "left",
            color: "#1E1E2A",
          }}
        >
          Documents
        </h1>
        <div className="mt-8">
          {documentTypes.map((dt) => (
            <div
              key={dt.id}
              style={{
                cursor: "pointer",
                fontWeight: currentType === dt.id ? "600" : "400",
                color: currentType === dt.id ? "#1E1E2A" : "#9D9DA7",
                padding: "2px",
                marginBottom: "10px",
              }}
              onClick={() => onDoctypeClick(dt.id)}
            >
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "19.6px",
                  textAlign: "right",
                }}
                className="hover:text-black"
              >
                {dt.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full">
        {selectedDocDetsils && (
          <div className="flex gap-1 flex-col">
            <div className="flex gap-1 flex-row items-center">
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  textAlign: "left",
                  color: "#1E1E2A",
                }}
              >
                {selectedDocDetsils.title}
              </h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex hover:bg-accent rounded-xl">
                    <SymbolIcon icon="info" size={20} color="#70707C" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="whitespace-break-spaces max-w-72">
                      {selectedDocDetsils.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-1 flex-col items-start max-w-screen-md">
              {showUpload || !rows.length ? (
                <div className="flex gap-4 flex-col">
                  <p
                    className="whitespace-break-spaces w-full"
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "19.6px",
                      textAlign: "left",
                      color: "#9D9DA7",
                    }}
                  >
                    {selectedDocDetsils.description}
                  </p>
                  <UploadFile />
                </div>
              ) : (
                <DataTable
                  showPagination={false}
                  showHeader={false}
                  columns={documentColumns}
                  showDownloadButton={false}
                  showUploadButton={true}
                  onUpload={toggleUploadSection}
                  data={rows}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
