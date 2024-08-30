"use client";

import React, { useState } from "react";
import isObject from "lodash/isObject";
import { Loader2Icon } from "lucide-react";
import { format } from "date-fns";
import { ErrorProps } from "@/types/general";
import { formatStringWithCount } from "@/utils/utils";
import { shareDocumentsSchema } from "@/types/schema-embedded";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { Button } from "@/components/ui/button";
import AutoForm from "@/components/ui/auto-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentApis from "@/actions/data/document.data";
import { isDemoEnv } from "../../../../../config";

const ShareDocumentsDialog = ({
  selectedDocuments = [],
  trigger = "button",
}: {
  selectedDocuments: Record<string, any>[];
  trigger?: "button" | "icon";
}) => {
  const { toast } = useToast();
  const [serverError, setServerError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onError = (err: string | ErrorProps) => {
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onSuccess = (res: any) => {
    setOpen(false);
    toast({
      duration: 4000,
      title: "Document email sent",
      description: `${selectedDocuments.length} shared documents`,
    });
    setLoading(false);
  };

  const handleShareDocuments = ({
    recipient_email,
  }: {
    recipient_email: string;
  }) => {
    if (loading || !recipient_email) return false;
    setLoading(true);
    return DocumentApis.shareDocuments({
      email: recipient_email,
      documents: selectedDocuments.map((doc) => doc.id),
    }).then(onSuccess, onError);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger === "button" ? (
          <Button className="gap-2 rounded-full" variant="outline">
            <span>{`Share ${formatStringWithCount(
              selectedDocuments.length,
              "Document"
            )}`}</span>
            <SymbolIcon icon="email" size={20} color="#000000" />
          </Button>
        ) : (
          <Button className="gap-2 rounded-full w-5 h-5 p-0" variant="ghost">
            <SymbolIcon icon="email" size={20} color="#000000" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-full h-screen z-[100] items-center sm:rounded-none justify-center">
        <div className="flex flex-col items-center py-5">
          <DialogHeader className="text-start w-full my-5">
            <DialogTitle>{`Share Documents`}</DialogTitle>
          </DialogHeader>
          <AutoForm
            formSchema={shareDocumentsSchema}
            fieldConfig={{}}
            defaultValues={{}}
            className="flex flex-col gap-4 max-w-lg mx-auto my-5"
            zodItemClass="flex flex-row grow gap-4 space-y-0 w-full"
            withSubmitButton={false}
            submitButtonText="Get started"
            submitButtonClass="background-primary"
            labelClass="text-primary"
            onSubmit={handleShareDocuments}
          >
            <Card className="w-full mb-5">
              <CardHeader className="p-3 border-b border-[#F7F7F9]">
                <CardTitle className="text-sm">{`Sharing ${selectedDocuments.length} document`}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 flex flex-col gap-2">
                {selectedDocuments.map((doc: Record<string, any>) => {
                  return (
                    <div key={doc.id} className="mb-2 flex-col gap-1">
                      <p className="text-base first-letter:capitalize">{`${doc.type} - ${doc.name}`}</p>
                      <p className="text-sm text-[#70707d]">{`${format(
                        new Date(doc.createdAt),
                        "MM-dd-yyyy"
                      )}`}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Alert className="p-3 bg-[#F7F7F9]">
              <AlertDescription className="gap-2 flex">
                <SymbolIcon size={24} icon="info" />
                <span>
                  Shared documents may include sensitive information like
                  account numbers, routing numbers, and transaction details.
                </span>
              </AlertDescription>
            </Alert>
            <DialogFooter className="flex flex-row w-full items-center justify-end mt-6 mb-4 my-2 h-12 gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="background-muted text-label hover:!background-muted h-8 px-10 rounded-full"
                  disabled={loading}
                >
                  {"Back"}
                </Button>
              </DialogClose>
              {!isDemoEnv() && (
                <Button
                  type="submit"
                  className="background-primary px-10 rounded-full h-8 gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  {"Share via email"}
                </Button>
              )}
            </DialogFooter>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "20px",
              }}
            >
              An email will be sent to your recipient with a link allowing them
              to download the statements shown above for 30 days.
            </p>
          </AutoForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDocumentsDialog;
