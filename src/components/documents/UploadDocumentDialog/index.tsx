"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import UploadFile from "@/components/generalComponents/UploadFile";
import { Button } from "@/components/ui/button";

const UploadDocumentDialog = ({
  document = {},
  trigger = "button",
  title = "Upload Document",
  onUploadSuccess,
}: {
  document: Record<string, any>;
  title: string;
  trigger?: "button" | "icon";
  onUploadSuccess?: (docment: Record<string, any>) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger === "button" ? (
          <Button className="gap-2 rounded-full" variant="outline">
            <span>Upload</span>
            <SymbolIcon icon="upload" size={20} color="#000000" />
          </Button>
        ) : (
          <Button className="gap-2 rounded-full w-5 h-5" variant="ghost">
            <SymbolIcon icon="upload" size={20} color="#000000" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="z-[100] items-center sm:rounded-none justify-center">
        <div className="flex flex-col items-center py-5">
          <DialogHeader className="text-start w-full my-5">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <UploadFile
            docType={document.type}
            document={document}
            onClose={() => setOpen(false)}
            onUploadSuccess={onUploadSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
