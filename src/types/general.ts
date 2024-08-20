import { z } from "zod";

export type dateRangeType = {
  startDate: string;
  endDate: string;
};

export type textType = {
  title: string;
  value: number;
  percentage?: number;
};

export type labelValue = {
  label: string;
  value: string;
};

export type switchModuleType = {
  title: string;
  description?: string;
  isActive: boolean;
};

export type cardDetails = {
  title?: string;
  dateRange: dateRangeType;
  download: string;
  leftText: textType;
  centerText: textType;
  rightText: textType;
};

export type sheetDataType = {
  title: textType;
  data: textType[];
  showFooter: boolean;
  footerData?: textType;
  isCollapsible: boolean;
};

export type bookKeepingStatusType = {
  value: "completed" | "pending" | "in-progress" | "upcoming";
};

export type moneyMovementDataType = {
  title: string;
  value: number;
  categories: textType[];
  avgValue: number;
  avgValueDistribution: number[];
};

export type profitLossType = {
  revenue: number;
  expenses: number;
};

export type profitLossDataType = {
  totalRevenue: number;
  totalExpenses: number;
  profitLoss: profitLossType[];
  fromMonth: string;
  toMonth: string;
};

export type monthlyGraphDataType = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
  month?: string;
};

export interface ErrorProps {
  message: string;
}

export type RowData = {
  id: string;
  label: string;
  formattedValue?: any;
  type: string;
  values?: Record<string, any>;
  schema?: z.ZodObject<Record<string, any>>;
  description?: string;
  isEditable?: boolean;
  actions?: Record<string, (data?: any) => Promise<false | void>>;
};

export interface IStatus {
  id: number;
  name: string;
}

export interface IRole {
  id: number;
  name: string;
}
