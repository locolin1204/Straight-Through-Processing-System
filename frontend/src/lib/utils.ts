import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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