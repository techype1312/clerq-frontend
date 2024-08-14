"use client";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { DataTable } from "@/components/dashboard/transactions/DataTable";
import UploadFile from "@/components/generalComponents/UploadFile";
import { ErrorProps } from "@/types/general";
import _ from "lodash";
import DocumentApis from "@/actions/apis/DocumentApis";
import { Check, Loader2Icon, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatStringWithCount } from "@/utils/utils";
import {
  inviteUserSchema,
  shareDocumentsSchema,
} from "@/types/schema-embedded";
import AutoForm from "@/components/ui/auto-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export enum DocumentTypes {
  FORM_W9 = "form_w9",
  FORM_1099 = "form_1099",
  TAX_PAYMENTS = "tax_payment",
  NOTICES = "notice",
  RECEIPTS = "receipt",
  TEMPLATES = "template",
  OTHERS = "other",
}

const documentTypes = [
  {
    id: DocumentTypes.FORM_1099,
    label: "Form 1099",
    title: "Form 1099",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocumentTypes.TAX_PAYMENTS,
    label: "Tax Payments",
    title: "Tax Payments",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocumentTypes.FORM_W9,
    label: "Form W9",
    title: "W9 Documents",
    description: `Form W-9, also known as the "Hey, We Need Your Tax Info" form, is used by the IRS in the U.S.\nIt's what businesses give to freelancers and other non-employees to get their tax ID number, so they can report how much they paid you.\nIt's like the IRS's way of saying, "We want to make sure you're paying your taxes!"`,
  },
  {
    id: DocumentTypes.RECEIPTS,
    label: "Receipts",
    title: "Receipts",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocumentTypes.TEMPLATES,
    label: "Templates",
    title: "Templates",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
  {
    id: DocumentTypes.NOTICES,
    label: "Notices",
    title: "Notices",
    description: `Think of Form 1099 as the IRS's "You Made Money, We Know It" form.\nIt's the way businesses tell the IRS about the cash they gave to freelancers, contractors, and others who aren't regular employees.\nIf you did some gig work, got paid, and thought no one noticed, surprise! The 1099 is there to say, "Nice try, but you still gotta pay taxes!`,
  },
];

const ColumnItem = ({
  label,
  row,
  checked,
  onCheck,
}: {
  label: string;
  row: Record<string, any>;
  checked: boolean;
  onCheck: (checked: boolean, id: string) => void;
}) => {
  const { toast } = useToast();
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
      <div className="flex text-label text-base gap-2 items-center">
        <Checkbox
          checked={checked}
          onCheckedChange={(val: boolean) => onCheck(val, row.id)}
          className="border-slate-[#FFFFFF] h-5 w-5 rounded-md data-[state=checked]:bg-[#465AD1] data-[state=checked]:text-primary-foreground"
        />
        <SymbolIcon icon="draft" color="#BFBFC5" />
        {label}
      </div>

      <div
        className="flex text-label text-base gap-4"
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
    </div>
  );
};

const ShareDocumentsDialog = ({
  selectedDocuments = [],
  trigger = "button",
}: {
  selectedDocuments: Record<string, any>[];
  trigger?: "button" | "icon";
}) => {
  return (
    <Dialog>
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
          <Button className="gap-2 rounded-full w-5 h-5" variant="ghost">
            <SymbolIcon icon="email" size={20} color="#000000" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-full and h-screen z-[100] items-center sm:rounded-none justify-center">
        <div
          className="flex flex-col w-max items-center min-w-64 py-5"
          style={{ maxWidth: "402px" }}
        >
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
          ></AutoForm>
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
                Shared documents may include sensitive information like account
                numbers, routing numbers, and transaction details.
              </span>
            </AlertDescription>
          </Alert>
          <DialogFooter className="flex flex-col w-full items-center sm:justify-end min-w-64 mt-6 mb-4 my-2 h-12 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="background-muted text-label hover:!background-muted h-8 px-10 rounded-full"
              >
                {"Back"}
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="background-primary px-10 rounded-full h-8"
            >
              {"Share via email"}
            </Button>
          </DialogFooter>
          <p
            style={{
              fontSize: "13px",
              lineHeight: "20px",
            }}
          >
            An email will be sent to your recipient with a link allowing them to
            download the statements shown above for 30 days.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Page = () => {
  const { toast, dismiss: dismissToast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState<string>(
    DocumentTypes.FORM_1099
  );
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const currentDocTypeDetails = documentTypes.find(
    (dt) => dt.id === currentType
  );

  const handleDocumentsSelection = (checked: boolean, id: string) => {
    const items = [...selectedDocuments];
    const index = items.indexOf(id);
    if (checked) {
      if (index === -1) {
        items.push(id);
      }
    } else {
      if (index !== -1) {
        items.splice(index, 1);
      }
    }
    setSelectedDocuments(items);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!documents.length) return;
    if (!checked) setSelectedDocuments([]);
    if (checked) setSelectedDocuments(documents.map((doc: any) => doc.id));
  };

  const documentColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => {
        return (
          <div className="flex text-label text-base gap-2 items-center px-2">
            <Checkbox
              checked={selectedDocuments.length !== 0}
              icon={
                selectedDocuments.length === documents.length ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )
              }
              onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
              className="border-slate-[#FFFFFF] h-5 w-5 rounded-md data-[state=checked]:bg-[#465AD1] data-[state=checked]:text-primary-foreground"
            />
            {"Documents"}
          </div>
        );
      },
      cell: ({ cell, row }) => {
        return (
          <ColumnItem
            label={cell.getValue() as string}
            row={row.original}
            checked={selectedDocuments.includes(row.original.id)}
            onCheck={handleDocumentsSelection}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (!selectedDocuments.length) {
      dismissToast();
      return;
    }
    toast({
      itemID: "SHARE_DOCUMENTS",
      duration: Infinity,
      title: `${selectedDocuments.length} ${formatStringWithCount(
        selectedDocuments.length,
        "document"
      )} selected`,
      description: "PDF File",
      action: (
        <div className="flex flex-row gap-2">
          <a
            target="_blank"
            href="https://stage-documents.joinotto.com/6ab61e7cb7614f5ab28f4.pdf"
          >
            <Button className="gap-2 rounded-full" variant="default">
              Download <SymbolIcon icon="download" size={20} color="#ffffff" />
            </Button>
          </a>

          <ShareDocumentsDialog
            selectedDocuments={documents.filter((doc: any) =>
              selectedDocuments.includes(doc.id)
            )}
          />
        </div>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDocuments]);

  const onDoctypeClick = (type: string) => {
    fetchDocuments(type);
    setCurrentType(type);
    setShowUpload(false);
    setSelectedDocuments([]);
  };

  const toggleUploadSection = () => {
    setShowUpload(!showUpload);
  };

  const onError = (err: string | ErrorProps) => {
    setError(_.isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onFetchDocumentsSuccess = (res: any) => {
    if (res.data && res.data?.data?.length) {
      setDocuments(res.data.data);
    }
    setLoading(false);
  };

  const fetchDocuments = useCallback(
    async (updatedType?: string) => {
      if (loading || !currentType || updatedType === currentType) return false;
      setLoading(true);
      return DocumentApis.getAllDocuments({
        filters: { type: updatedType || currentType },
      }).then(onFetchDocumentsSuccess, onError);
    },
    [currentType, loading]
  );

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {currentDocTypeDetails && (
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
                {currentDocTypeDetails.title}
              </h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex hover:bg-accent rounded-xl">
                    <SymbolIcon icon="info" size={20} color="#70707C" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="whitespace-break-spaces max-w-72">
                      {currentDocTypeDetails.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-1 flex-col items-start max-w-screen-md">
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
                {currentDocTypeDetails.description}
              </p>
              {showUpload || (!documents.length && !loading) ? (
                <div className="flex gap-4 flex-col mt-4 w-full">
                  {!documents.length && !loading && (
                    <span>No document found! Upload one.</span>
                  )}
                  <UploadFile />
                </div>
              ) : (
                <Fragment>
                  {loading ? (
                    <div className="w-full flex items-center h-12 justify-center">
                      <Loader2Icon className="animate-spin" />
                    </div>
                  ) : (
                    <DataTable
                      showFilter={false}
                      showPagination={false}
                      showHeader={true}
                      columns={documentColumns}
                      showDownloadButton={false}
                      showUploadButton={true}
                      onUpload={toggleUploadSection}
                      data={documents}
                    />
                  )}
                </Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
