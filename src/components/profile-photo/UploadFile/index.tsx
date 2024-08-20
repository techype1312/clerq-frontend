"use client";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import uniqBy from "lodash/uniqBy";
import flatMap from "lodash/flatMap";
import isObject from "lodash/isObject";
import { FileRejection } from "react-dropzone";
import { convertFileSize } from "@/utils/file";
import { ErrorProps } from "@/types/general";
import FileApis from "@/actions/apis/FileApis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Dropzone from "@/components/generalComponents/Dropzone";
import SymbolIcon from "@/components/generalComponents/MaterialSymbol/SymbolIcon";
import { IImageFileType, ILocalFile } from "@/types/file";

const MAX_FILES = 1;

interface UploadFileProps {
  onUploadSuccess?: (photo: IImageFileType) => void;
}

const UploadProfilePhoto = (props: UploadFileProps) => {
  const [files, setFiles] = useState<ILocalFile[]>([]);
  const [errMsg, setErrMsg] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileRes, setFileResponse] = useState<IImageFileType | null>(null);

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

  const onFileUploadSuccess = (res: any) => {
    if (res && res.data) {
      setFileResponse(res.data.file);
    }
    setLoading(false);
  };

  const handleUploadFiles = () => {
    if (loading || !files.length) return false;
    setLoading(true);
    return FileApis.uploadFile({
      fileData: files[0],
    }).then(onFileUploadSuccess, onError);
  };

  const setProfile = () => {
    if (fileRes && props.onUploadSuccess) {
      props.onUploadSuccess(fileRes);
    }
  };

  const removeFile = () => {
    setUploadError("");
    setErrMsg("");
    setLoading(false);
    setFileResponse(null);
    setFiles([]);
  };

  useEffect(() => {
    handleUploadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length]);

  return (
    <Fragment>
      {fileRes ? (
        <Card className="w-full bg-[#F7F7F8]">
          <CardContent className="p-0 flex flex-col items-center justify-center">
            <Image
              src={fileRes.path}
              className="rounded-lg"
              alt={fileRes.id}
              width={400}
              height={400}
              style={{
                maxHeight: "400px",
                padding: "20px",
              }}
            />
            <div className="h-10 w-full rounded-b-md flex items-center text-sm gap-4 px-4 bg-white hover:bg-[#F7F7F8]">
              <a
                target="_blank"
                className="h-6 py-1 flex flex-row w-full gap-2 items-center "
                href={fileRes.path}
              >
                <SymbolIcon icon="open_in_new" size={20} />
                {files[0].name}
              </a>

              <Button onClick={removeFile} variant="ghost" className="h-6 w-6">
                <SymbolIcon icon="close" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="w-full border-2 border-[#DCDCE4] border-dashed hover:border-blue-700  cursor-pointer bg-[#F7F7F8] mt-5"
          style={{
            touchAction: loading ? "none" : "initial",
          }}
        >
          <CardContent className="p-0 flex flex-col items-center justify-center">
            <Dropzone
              onDrop={onDrop}
              accept={{
                "image/*": [".jpeg", ".png", ".jpg"],
              }}
              onDropRejected={onDropRejected}
              maxFiles={MAX_FILES}
              disabled={!MAX_FILES || loading}
            />
            {errMsg && <div className="text-red-500 mt-2">{errMsg}</div>}
          </CardContent>
        </Card>
      )}
      <div className="w-full flex flex-row justify-end gap-2 mt-4">
        <Button
          className="border py-2 rounded-full background-text-primary text-white w-fit px-4 gap-2"
          disabled={loading || !files.length}
          onClick={setProfile}
        >
          {loading && <Loader2Icon className="animate-spin" />}
          Save
        </Button>
      </div>
    </Fragment>
  );
};

export default UploadProfilePhoto;
