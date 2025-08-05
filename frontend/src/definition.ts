import { UTCTimestamp } from "lightweight-charts";

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

export interface User {
    id: number;
    name: string;
    cash: number;
}

export interface Ticker {
    ticker: string;
    name: string;
}

export interface LiveStockData {
    timestamp: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ticker: string;
}

export interface StockTableProps {
    tableName: string;
    desc: string;
    icon: React.ReactNode;
    tickers: StockTableTickerProps[];
}

export interface StockTableTickerProps {
    ticker: string;
    percentage: number;
    curPrice: number;
}

export interface HistoricalData {
    id: number;
    ticker: string;
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    adjustedClose: number;
    volume: number;
    dividendAmount: number;
    splitCoefficient: number;
}

export interface News {
    id: number;
    title: string;
    timePublished: number;
    topics: NewsTopic[];
    tickerSentimentList: TickerSentiment[];
}

export interface TickerSentiment {
    ticker: string;
    relevanceScore: number
    ticker_sentiment_label: string;
    ticker_sentiment_score: number;
}

export interface NewsTopic {
    topic: string;
    relevance_score: number;
}


export interface TradeRecord {
    id: number;
    userId: number;
    ticker: string;
    quantity: number;
    tradeType: string;
    pricePerShare: number;
    pnl: number | null;
    tradeTimestamp: number;
}

export interface CurrentHolding {
    ticker: string;
    averagePrice: number;
    quantity: number;
    userId: number;
}

export interface TradeRecordBody {
    userId: number;
    ticker: string;
    quantity: number;
    tradeType: string;
    pricePerShare: number;
    tradeTimestamp: number;
}

export interface SellTradeRequest {
    ticker: string;
    userId: number;
    marketPrice: number;
}

