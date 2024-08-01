export type dateRangeType = {
  startDate: string;
  endDate: string;
};

export type textType = {
  title: string;
  value: number;
};

export type cardDetails = {
  title?: string;
  dateRange: dateRangeType;
  download: string;
  leftText: textType;
  centerText: textType;
  rightText: textType;
};
