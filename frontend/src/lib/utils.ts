import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, subHours } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calPercentageChange(newNum: number, oldNum: number) {
  return ((newNum - oldNum) / oldNum) * 100;
}

export function isPositive(num: number) {
  return num > 0;
}

export function getSignFromNumber(num: number) {
  return isPositive(num) && "+";
}

export function calMarketPrice(high: number, low: number, close: number ) {
  return (high + low + close) / 3;
}

export function formatDate (date: number) {
  return format(subHours(date*1000, 8), 'dd MMM yyyy HH:mm')
}

export function formatNumber (number: number) {
  return number.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}