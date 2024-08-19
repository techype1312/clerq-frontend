import { convertBase64toFile } from "@/utils/file";
import { ILocalFile } from "@/types/file";
import { getCookie } from "../cookieUtils";
import * as ApiCalls from "../ApiCalls";

const uploadFile = ({ fileData }: { fileData: ILocalFile }) => {
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
