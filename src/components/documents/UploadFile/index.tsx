"use client";

import React, { useCallback, useState } from "react";
import uniqBy from "lodash/uniqBy";
import flatMap from "lodash/flatMap";
import isObject from "lodash/isObject";
import { FileRejection } from "react-dropzone";
import DocumentApis from "@/actions/apis/DocumentApis";
import { convertFileSize } from "@/utils/file";
import { DocumentTypes } from "@/utils/types/document";
import { ErrorProps } from "@/types/general";
import { updateDocumentsSchema } from "@/types/schema-embedded";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SymbolIcon from "../../generalComponents/MaterialSymbol/SymbolIcon";
import Dropzone from "@/components/generalComponents/Dropzone";

const MAX_FILES = 1;

const FileItem = ({ file }: { file: IFile }) => {
  return (
    <div className="flex flex-row gap-2 items-center border-2 rounded-md py-1 px-6">
      <SymbolIcon icon="draft" />
      <div className="flex flex-col gap-0 items-start">
        <div className="text-sm">{file.name}</div>
        <div className="text-xs text-gray-400">{file.size}</div>
      </div>
    </div>
  );
};

interface IFile {
  id: number;
  src: string;
  name: string;
  size: string;
  type: string;
}

interface UploadFileProps {
  docType: DocumentTypes;
  hideCloseBtn?: boolean;
  document?: Record<string, any>;
  onClose?: () => void;
  onUploadSuccess?: (docment: Record<string, any>) => void;
}

const UploadFile = (props: UploadFileProps) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileTooLargeErrMsg = `The overall size of the pdf should not exceed 25mb.`;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setErrMsg("");
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e: any) {
        setFiles([
          {
            id: 1,
            src: e.target.result,
            name: file.name,
            size: convertFileSize(file.size),
            type: file.type,
          },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const onDropRejected = (errs: FileRejection[]) => {
    const uniqueErrorCodes = uniqBy(flatMap(errs, "errors"), "code").map(
      (error: { code: string }) => error.code
    );
    let msg = "";
    if (uniqueErrorCodes.includes("file-too-large")) {
      msg = fileTooLargeErrMsg;
    }
    if (uniqueErrorCodes.includes("too-many-files")) {
      msg = `Only ${MAX_FILES} file can be uploaded.`;
    }
    setErrMsg(msg);
  };

  const onError = (err: string | ErrorProps) => {
    setUploadError(isObject(err) ? err.message : err);
    setLoading(false);
  };

  const onDocumentUploadSuccess = (res: any) => {
    if (res && props.onUploadSuccess) {
      props.onUploadSuccess(res.data);
    }
    setLoading(false);
  };

  const handleUploadFiles = ({ title }: { title: string }) => {
    if (loading || !props.docType || !files.length) return false;
    setLoading(true);
    if (props.document && props.document?.id) {
      return DocumentApis.updateDocuments(props.document.id, {
        fileData: files[0],
        docType: props.docType,
        name: title,
      }).then(onDocumentUploadSuccess, onError);
    } else {
      return DocumentApis.uploadDocuments({
        fileData: files[0],
        docType: props.docType,
        name: title,
      }).then(onDocumentUploadSuccess, onError);
    }
  };

  return (
    <AutoForm
      formSchema={updateDocumentsSchema}
      fieldConfig={{}}
      defaultValues={{
        title: props.document?.name,
      }}
      className="flex flex-col gap-4 my-5"
      zodItemClass="flex flex-row grow gap-4 space-y-0 w-full"
      withSubmitButton={false}
      submitButtonText="Get started"
      submitButtonClass="background-primary"
      labelClass="text-primary"
      onSubmit={handleUploadFiles}
    >
      <Card className="border-2 border-[#DCDCE4] border-dashed hover:border-blue-700  cursor-pointer bg-[#F7F7F8]">
        <CardContent
          className="p-0 flex flex-col"
          style={{
            alignItems: "center",
            justifyContent: "center",
            color: "#1E1E2A",
            textAlign: "center",
          }}
        >
          <Dropzone
            onDrop={onDrop}
            accept={{
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "text/csv": [".csv"],
            }}
            onDropRejected={onDropRejected}
            maxFiles={MAX_FILES}
            disabled={!MAX_FILES}
          />
          {!!files.length && (
            <div className="flex-col gap-2 mt-2 mb-4">
              {files.map((file) => (
                <FileItem file={file} key={file.id} />
              ))}
            </div>
          )}
          {errMsg && <div className="text-red-500 mt-2">{errMsg}</div>}
        </CardContent>
      </Card>
      <div className="flex flex-row justify-end gap-2">
        {props.onClose && !props.hideCloseBtn && (
          <Button
            className="border py-3 rounded-full w-fit px-12"
            variant="outline"
            onClick={props.onClose}
            disabled={loading}
          >
            Close
          </Button>
        )}
        <AutoFormSubmit
          className="border py-3 rounded-full background-text-primary text-white w-fit px-12"
          disabled={loading}
        >
          Submit
        </AutoFormSubmit>
      </div>
    </AutoForm>
  );
};

export default UploadFile;
