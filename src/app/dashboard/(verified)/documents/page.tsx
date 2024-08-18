"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import compact from "lodash/compact";
import isObject from "lodash/isObject";
import { Check, Loader2Icon, Minus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ErrorProps } from "@/types/general";
import DocumentApis from "@/actions/apis/DocumentApis";
import { formatStringWithCount } from "@/utils/utils";
import {
  DocumentTypes,
  DocumentUploadStatusEnum,
} from "@/utils/types/document";
import { documentDetails } from "@/utils/constants/document";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ShareDocumentsDialog from "@/components/documents/ShareDocumentsDialog";
import DocumentListItem from "@/components/documents/DocumentListItem";

const Page = () => {
  const { toast, dismiss: dismissToast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentType, setCurrentType] = useState<DocumentTypes>(
    DocumentTypes.FORM_1099
  );
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [documents, setDocuments] = useState<any>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const currentDocTypeDetails = documentDetails.find(
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
    if (checked)
      setSelectedDocuments(
        compact(
          documents.map((doc: any) =>
            doc.status === DocumentUploadStatusEnum.UPLOADED
              ? doc.id
              : undefined
          )
        )
      );
  };

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

  const onDoctypeClick = (type: DocumentTypes) => {
    fetchDocuments(type);
    setCurrentType(type);
    setShowUpload(false);
    setSelectedDocuments([]);
  };

  const toggleUploadSection = () => {
    setShowUpload(!showUpload);
  };

  const onError = (err: string | ErrorProps) => {
    setError(isObject(err) ? err.message : err);
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

  const uploadDocumentSuccess = (document: any) => {
    if (!document) return;
    const items = [...documents];
    const docIndex = items.find((doc) => doc.id === document.id);
    if (docIndex !== -1) {
      items.splice(docIndex, 1);
    }
    items.push({ ...document, status: DocumentUploadStatusEnum.UPLOADING });
    toast({
      duration: 4000,
      title: `Document is ${docIndex === -1 ? "uploading" : "updating"}...`,
    });
    setShowUpload(false);
    setDocuments([document, ...documents]);
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
          <DocumentListItem
            label={cell.getValue() as string}
            row={row.original}
            checked={selectedDocuments.includes(row.original.id)}
            onCheck={handleDocumentsSelection}
            onUploadSuccess={uploadDocumentSuccess}
          />
        );
      },
    },
  ];

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
          {documentDetails.map((dt) => (
            <div
              key={dt.id}
              style={{
                cursor: "pointer",
                fontWeight: currentType === dt.id ? "600" : "400",
                color: currentType === dt.id ? "#1E1E2A" : "#9D9DA7",
                padding: "2px",
                marginBottom: "10px",
                pointerEvents: loading ? 'none' : 'visible'
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
                  <UploadFile
                    docType={currentType}
                    onClose={toggleUploadSection}
                    hideCloseBtn={!documents.length}
                    onUploadSuccess={uploadDocumentSuccess}
                  />
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
