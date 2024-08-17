import { convertBase64toFile } from "@/utils/file";
import * as ApiCalls from "../ApiCalls";
import { getCookie } from "../cookieUtils";
import { DocumentTypes } from "@/utils/types/document";

interface IFile {
  id: number;
  src: string;
  name: string;
  size: string;
  type: string;
}

const uploadFile = ({ fileData }: { fileData: IFile }) => {
  const token = getCookie("token") || null;
  const ucrmKey = getCookie("otto_ucrm") || null;

  const formData = new FormData();
  const file = convertBase64toFile(fileData.src, fileData.name);
  formData.set("file", file);

  return ApiCalls.postResponseFormData(
    `files/upload`,
    formData,
    token,
    ucrmKey
  );
};

const FileApis = {
  uploadFile,
};

export default FileApis;
