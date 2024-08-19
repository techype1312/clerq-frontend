export enum DocumentTypes {
  FORM_W9 = "form_w9",
  FORM_1099 = "form_1099",
  TAX_PAYMENTS = "tax_payment",
  NOTICES = "notice",
  RECEIPTS = "receipt",
  TEMPLATES = "template",
  OTHERS = "other",
}

export enum DocumentUploadStatusEnum {
  PENDING = "pending",
  UPLOADING = "uploading",
  UPLOADED = "uploaded",
  FAILED = "failed",
  RETRYING = "retrying",
}

export interface IImageFileType {
  id: string;
  path: string;
}

export interface ILocalFile {
  id: number;
  src: string;
  name: string;
  size: string;
  type: string;
}
