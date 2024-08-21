import castArray from "lodash/castArray";
import map from "lodash/map";
import axios from "axios";

export const MAX_IMAGE_DIMENSIONS = 512;
export const MAX_FILES = 15;
export const MAX_FILE_PREVIEW = 3;
export const MAX_FILE_SIZE = 1000 * 1024 * 5 * 5;
export const MAX_FILE_SIZE_TEXT = "25mb";

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const convertFilesToBase64 = (
  images: File | File[]
): Promise<(string | ArrayBuffer | null)[]> => {
  return Promise.all(map(castArray(images), getBase64));
};

export const convertBase64toFile = (base64: string, filename: string): File => {
  const arr = base64.split(",");
  const type = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type });
};

export const convertFilesToBlobs = (images: File | File[]): string[] => {
  return map(castArray(images), (image) => window.URL.createObjectURL(image));
};

const call = async (image: {
  preview: string;
  name: string;
}): Promise<File> => {
  if (!image.preview) return Promise.resolve(image as unknown as File);
  const { data } = await axios({ url: image.preview, responseType: "blob" });
  return new File([data], image.name, { type: data.type });
};

export const convertBlobsToFiles = (
  images:
    | { preview: string; name: string }
    | { preview: string; name: string }[]
): Promise<File[]> => {
  return Promise.all(map(castArray(images), call));
};

export const revokeObjectURL = (image: string) =>
  window.URL.revokeObjectURL(image);

export const convertFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const converted = (bytes / Math.pow(1024, i)).toFixed(2);

  return `${parseFloat(converted)} ${units[i]}`;
};
