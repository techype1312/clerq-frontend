import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addYears } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const generateDateRange = () => {
  const today = new Date();
  const startYear = 2023;
  const dateRange = [];
  
  let currentStartDate = new Date(startYear, 4); // May 2023

  while (currentStartDate < today) {
    const currentEndDate = addYears(currentStartDate, 1);
    dateRange.push({
      startDate: format(currentStartDate, 'MMMM yyyy'),
      endDate: format(currentEndDate, 'MMMM yyyy'),
    });
    currentStartDate = currentEndDate;
  }

  return dateRange.reverse();
};