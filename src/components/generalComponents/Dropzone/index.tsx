import React from "react";
import {
  useDropzone,
  DropzoneOptions,
  DropEvent,
  FileRejection,
  Accept,
} from "react-dropzone";
import { Button } from "@/components/ui/button";
import SymbolIcon from "../MaterialSymbol/SymbolIcon";

const MAX_FILE_SIZE = 1000 * 1024 * 5 * 5;

interface DropzoneProps {
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
  onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
  onError?: (error: Error) => void;
  accept?: Accept;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
}

const Dropzone = ({
  onDrop,
  onDropRejected,
  onError,
  accept,
  maxSize = MAX_FILE_SIZE,
  maxFiles = 1,
  disabled = false,
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    onDropRejected,
    onError,
    disabled,
  } as DropzoneOptions);

  return (
    <div
      {...getRootProps({ className: "dropzone" })}
      className="py-6 flex flex-col gap-4 "
      style={{
        alignItems: "center",
        justifyContent: "center",
        color: "#1E1E2A",
        textAlign: "center",
        width: "100%",
      }}
    >
      <input {...getInputProps()} />
      <SymbolIcon icon="upload_file" size={24} />
      <div className="w-full">
        <span
          style={{
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          {`Drag and drop here or click to upload`}
        </span>
        <br />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "20px",
          }}
        >
          {`You may upload PNG or JPEG files`}
        </span>
      </div>
    </div>
  );
};

export default Dropzone;
