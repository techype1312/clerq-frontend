import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, addYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateDateRange = () => {
  const today = new Date();
  const startYear = 2023;
  const dateRange = [];

  let currentStartDate = new Date(startYear, 4); // May 2023

  while (currentStartDate < today) {
    const currentEndDate = addYears(currentStartDate, 1);
    dateRange.push({
      startDate: format(currentStartDate, "MMMM yyyy"),
      endDate: format(currentEndDate, "MMMM yyyy"),
    });
    currentStartDate = currentEndDate;
  }

  return dateRange.reverse();
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  const startMonth = new Date(startDate).toLocaleString("default", {
    month: "long",
  });

  return `${startMonth} ${startYear}-${endYear.toString().slice(-2)}`;
};
export const formatDateRangeWithDay = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startDay = start.getDate();
  const startMonth = start.toLocaleString("default", { month: "short" });
  const startYear = start.getFullYear();

  const endDay = end.getDate();
  const endMonth = end.toLocaleString("default", { month: "short" });
  const endYear = end.getFullYear();

  if(startMonth === endMonth){
    return `${startMonth} ${startDay} - ${endDay} , ${endYear}`;

  }else if (startYear !== endYear){
    return `${startMonth} ${startDay} , ${startYear} - ${endMonth} ${endDay} , ${endYear}`;
    
  }else{
    return `${startMonth} ${startDay}  - ${endMonth} ${endDay} , ${endYear}`;
  }
};

export const formatFilterId = (id: string): string => {
  return id.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export function formatPhone(phone: string) {
  const countryCodeLength = 1;
  
  const countryCode = phone.slice(0, countryCodeLength);
  const localNumber = phone.slice(countryCodeLength);

  return { countryCode, localNumber };
}

export const formatPhoneNumber = (phone: string, countryCode: number | string) => {
  if (!phone || !countryCode) return '';

  const phoneStr = phone.toString();
  const formattedPhone = `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(
    3,
    6
  )}-${phoneStr.slice(6)}`;

  const result = `+${countryCode} ${formattedPhone}`;
  return result;
};

export function formatStringWithCount(count: number, word: string) {
  return `${word}${count > 1 ? 's' : ''}`;
}

interface Address {
  country: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
}

export const formatAddress = (address: Address) => {
  if (!address) return '';
  const { country, address_line_1, address_line_2, city, state, postal_code } =
    address;

  return `${address_line_1}
${address_line_2}
${city}, ${state} ${postal_code}
${country}`;
};


export const calculateDateRange = (value: string) => {
  const today = new Date();
  let from: Date, to: Date;

  if (value === 'last_30_days') {
    to = today;
    from = new Date(today);
    from.setDate(today.getDate() - 30);
  } else if (value === 'this_month') {
    from = new Date(today.getFullYear(), today.getMonth(), 1);
    to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (value === 'last_month') {
    from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    to = new Date(today.getFullYear(), today.getMonth(), 0);
  } else if (value === 'last_4_financial_quarters') {
    const currentQuarter = Math.floor((today.getMonth() + 3) / 3);
    const startQuarter = currentQuarter - 4;
    from = new Date(today.getFullYear(), (startQuarter - 1) * 3, 1);
    to = new Date(today.getFullYear(), currentQuarter * 3, 0);
  } else if (value === 'this_year') {
    from = new Date(today.getFullYear(), 0, 1);
    to = new Date(today.getFullYear(), 11, 31);
  } else if (value === 'last_year') {
    from = new Date(today.getFullYear() - 1, 0, 1);
    to = new Date(today.getFullYear() - 1, 11, 31);
  } else if (value === 'all') {
    from = new Date(1970, 0, 1); // Arbitrary start date
    to = today;
  } else {
    from = to = today;
  }

  return { from, to };
};