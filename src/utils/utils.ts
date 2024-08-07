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
  
  console.log("Country Code:", countryCode);
  console.log("Local Number:", localNumber);

  return { countryCode, localNumber };
}