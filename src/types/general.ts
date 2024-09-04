import { HttpStatusCode } from "axios";
import { z } from "zod";

export type DateRangeType = {
  year: string;
  startDate: string;
  endDate: string;
};

export type TextType = {
  label: string;
  value: number;
  percentage?: number;
};

export type LabelValue = {
  label: string;
  value: string;
};

export type SwitchModuleType = {
  title: string;
  description?: string;
  isActive: boolean;
};

export type CardDetails = {
  title?: string;
  dateRange: DateRangeType;
  download: string;
  leftText: TextType;
  centerText: TextType;
  rightText: TextType;
};

export type SheetDataType = {
  title: TextType;
  data: TextType[];
  showFooter: boolean;
  footerData?: TextType;
  isCollapsible: boolean;
};

export type BookKeepingStatusType = {
  value: "completed" | "pending" | "in-progress" | "upcoming";
};

export type MoneyMovementDataType = {
  title: string;
  value: number;
  categories: TextType[];
  avgValue: number;
  avgValueDistribution: number[];
};

export type profitLossType = {
  revenue: number;
  expenses: number;
};

export type ProfitLossDataType = {
  totalRevenue: number;
  totalExpenses: number;
  profitLoss: profitLossType[];
  fromMonth: string;
  toMonth: string;
};

export type MonthlyGraphDataType = {
  name: string;
  uv: number;
  pv: number;
  amt: number;
  month?: string;
};

export interface ErrorProps {
  status: HttpStatusCode;
  errors: Record<string, string>;
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

export interface ISearchSelects {
  id: number;
  icon: JSX.Element;
  name: string;
}

export interface IRole {
  id: number;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
}
