"use client";

import React, { Fragment, Suspense, useCallback, useEffect, useState } from "react";
import compact from "lodash/compact";
import isObject from "lodash/isObject";
import { Check, Minus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { ErrorProps } from "@/types/general";
import { formatStringWithCount } from "@/utils/utils";
import { DocumentTypes, DocumentUploadStatusEnum } from "@/types/file";
import { documentDetails } from "@/utils/constants/document";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SymbolIcon from "@/components/common/MaterialSymbol/SymbolIcon";
import { DataTable } from "@/components/common/table/DataTable";
import UploadFile from "@/components/dashboard/documents/UploadFile";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ShareDocumentsDialog from "@/components/dashboard/documents/ShareDocumentsDialog";
import DocumentListItem from "@/components/dashboard/documents/DocumentListItem";
import DocumentApis from "@/actions/data/document.data";
import DocumentSkeleton from "@/components/skeletons/dashboard/DocumentSkeleton";

const DocumentsPage = () => {
  const { toast, dismiss: dismissToast } = useToast();
  const [serverError, setServerError] = useState("");
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
        <div className="flex flex-row max-sm:flex-col gap-4">
          <a
            target="_blank"
            href="https://stage-documents.joinotto.com/6ab61e7cb7614f5ab28f4.pdf"
          >
            <Button className="gap-2 rounded-full w-full" variant="default">
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
    setServerError(isObject(err) ? err.errors.message : err);
    setLoading(false);
  };

  const onFetchDocumentsSuccess = (res: any) => {
    if (res && res.data) {
      setDocuments(res.data);
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
    <div className="flex gap-24 flex-row justify-center">
      <div className="w-full lg:max-w-[950px]">
        <div className="flex gap-8 md:gap-24 flex-col md:flex-row">
          <div>
            <h1 className="text-2xl font-medium text-left text-primary max-md:hidden">
              Documents
            </h1>
            <div className="mt-2 md:mt-8 flex flex-row md:flex-col overflow-auto gap-2">
              {documentDetails.map((dt) => (
                <div
                  key={dt.id}
                  style={{
                    pointerEvents: loading ? "none" : "visible",
                  }}
                  className={`cursor-pointer p-0.5 mb-2.5 text-nowrap ${
                    currentType === dt.id
                      ? "font-semibold text-primary"
                      : "font-normal text-muted"
                  } + ${
                    loading ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                  onClick={() => onDoctypeClick(dt.id)}
                >
                  <p className="text-sm text-right hover:text-black">
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
                  <h1 className="text-lg font-normal text-left text-primary">
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
                  <p className="whitespace-break-spaces w-full text-sm font-normal text-left text-muted">
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
                      <DataTable
                        showFilter={false}
                        showPagination={false}
                        showHeader={true}
                        columns={documentColumns}
                        showDownloadButton={false}
                        showDownload={false}
                        showUploadButton={true}
                        onUpload={toggleUploadSection}
                        data={documents}
                        loading={loading}
                        type="document"
                      />
                    </Fragment>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Page() {
  return (
    <Suspense fallback={<DocumentSkeleton />}>
      <DocumentsPage />
    </Suspense>
  );
}