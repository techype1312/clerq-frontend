import React from "react";
import {
  useDropzone,
  DropzoneOptions,
  DropEvent,
  FileRejection,
  Accept,
} from "react-dropzone";
import { Button } from "@/components/ui/button";

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
      className="pt-6 flex flex-col"
      style={{
        alignItems: "center",
        justifyContent: "center",
        color: "#1E1E2A",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      <div>
        <span
          style={{
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: "24px",
          }}
        >
          {`Drag & drop files`}
        </span>
        <br />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "19.6px",
          }}
        >
          {`OR browse from your device by clicking on “Upload”.`}
        </span>
      </div>
      <Button className="flex items-center gap-2 mt-6 rounded-full px-10" variant="outline" type="button">
        Upload
      </Button>
    </div>
  );
};

export default Dropzone;
