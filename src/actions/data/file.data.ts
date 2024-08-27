import { convertBase64toFile } from "@/utils/file";
import { ILocalFile } from "@/types/file";
import { post } from "@/utils/fetch.util";

const uploadFile = async ({ fileData }: { fileData: ILocalFile }) => {
  const formData = new FormData();
  const file = convertBase64toFile(fileData.src, fileData.name);
  formData.set("file", file);

  return post({
    url: `/v1/files/upload`,
    data: formData,
    headers: {
      Accept: "multipart/form-data",
      "Content-Type": "multipart/form-data",
    },
  }).then((resp) => resp);
};

const FileApis = {
  uploadFile,
};

export default FileApis;
