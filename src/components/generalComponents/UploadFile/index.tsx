import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "@/components/ui/button";
import _ from "lodash";
import Dropzone from "./Dropzone";
import { FileRejection } from "react-dropzone";

const maxFiles = 1;
const UploadFile = () => {
  const [files, setFiles] = useState<Record<string, any>[]>([]);
  const [errMsg, setErrMsg] = useState("");

  const fileTooLargeErrMsg = `The overall size of the images/videos should not exceed 25mb.`;

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
            // size: convertFileSize(file.size),
            type: file.type,
          },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const onDropRejected = (errs: FileRejection[]) => {
    console.log("onDropRejected");
    const uniqueErrorCodes = _.uniqBy(_.flatMap(errs, "errors"), "code").map(
      (error) => error.code
    );
    let msg = "";
    if (uniqueErrorCodes.includes("file-too-large")) {
      msg = fileTooLargeErrMsg;
    }
    if (uniqueErrorCodes.includes("too-many-files")) {
      msg = `Only ${maxFiles} file can be uploaded.`;
    }
    setErrMsg(msg);
  };

  return (
    <Card
      style={{
        background: "#F7F7F8",
        border: "1px dashed #DCDCE4",
        padding: "50px",
      }}
    >
      <CardContent
        className="pt-6 flex flex-col"
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
            "image/*": [".jpeg", ".png", ".jpg", ".webp"],
          }}
          onDropRejected={onDropRejected}
          maxFiles={maxFiles}
          disabled={!maxFiles}
        />
        <div className="text-red-500 mt-2">{errMsg}</div>
      </CardContent>
    </Card>
  );
};

export default UploadFile;
