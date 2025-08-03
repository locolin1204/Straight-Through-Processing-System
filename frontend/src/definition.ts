export interface ModifyBalanceUser {
    id: number; // Using 'number' in TypeScript for Java's 'Long'
    amount: number;
}

export interface UpdateBalanceSuccessResponse {
    updatedBalance: number;
}

export interface ApiErrorResponse {
    timestamp: string;
    status: number;
    error: string;
    trace?: string; // Optional trace for detailed debugging
    message?: string; // General error message
    path?: string;
}

export type User = {
    id: number;
    name: string;
    cash: number;
}

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface Ticker {
    ticker: string;
    name: string;
}