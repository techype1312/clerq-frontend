"use client";

import React, { Fragment } from "react";
import { format } from "date-fns";
import { DocumentUploadStatusEnum } from "@/types/file";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Checkbox } from "@/components/ui/checkbox";
import UploadDocumentDialog from "@/components/dashboard/documents/UploadDocumentDialog";
import ShareDocumentsDialog from "@/components/dashboard/documents/ShareDocumentsDialog";

const DocumentListItem = ({
  row,
  checked,
  onCheck,
  onUploadSuccess,
}: {
  label: string;
  row: Record<string, any>;
  checked: boolean;
  onCheck: (checked: boolean, id: string) => void;
  onUploadSuccess?: (docment: Record<string, any>) => void;
}) => {
  const renderActions = () => {
    switch (row.status) {
      case DocumentUploadStatusEnum.UPLOADED:
        return (
          <div
            className="flex text-label text-base gap-4 justify-end"
            style={{
              color: "#70707C",
            }}
          >
            <div className="cursor-pointer hover:text-black flex items-center">
              <a target="_blank" href={row.path}>
                <SymbolIcon icon="download" />
              </a>
            </div>
            <div className="cursor-pointer hover:text-black flex items-center">
              <ShareDocumentsDialog selectedDocuments={[row]} trigger="icon" />
            </div>
          </div>
        );
      case DocumentUploadStatusEnum.FAILED:
        return (
          <div className="flex text-label text-base gap-4 justify-end">
            <UploadDocumentDialog
              document={row}
              trigger="icon"
              title="Update Document"
              onUploadSuccess={onUploadSuccess}
            />
          </div>
        );
      default:
        return (
          <div className="first-letter:capitalize text-right px-2">
            {row.status}...
          </div>
        );
    }
  };

  return (
    <div
      className="flex w-full items-center justify-between px-2"
      style={{
        color: "#535460",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "22.4px",
        textAlign: "left",
      }}
      id={row.id}
    >
      <div className="flex text-label text-base gap-2 items-center" id={row.id}>
        <Checkbox
          checked={row.status === DocumentUploadStatusEnum.UPLOADED && checked}
          onCheckedChange={(val: boolean) => onCheck(val, row.id)}
          className="border-slate-[#FFFFFF] h-5 w-5 rounded-md data-[state=checked]:bg-[#465AD1] data-[state=checked]:text-primary-foreground"
          disabled={row.status !== DocumentUploadStatusEnum.UPLOADED}
        />
        <SymbolIcon icon="draft" color="#BFBFC5" />

        <div className="flex-col gap-1">
          <p className="text-sm first-letter:capitalize max-md:max-w-[200px] md:max-w-[300px] text-pretty">
            {row.name}
          </p>
          <p className="text-xs text-[#70707d]">{`${format(
            new Date(row.createdAt),
            "MM-dd-yyyy"
          )}`}</p>
        </div>
      </div>
      <Fragment>{renderActions()}</Fragment>
    </div>
  );
};

export default DocumentListItem;
