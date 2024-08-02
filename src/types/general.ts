export type dateRangeType = {
  startDate: string;
  endDate: string;
};

export type textType = {
  title: string;
  value: number;
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
