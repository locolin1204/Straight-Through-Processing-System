import StockSelector from '@/components/stocks/stock-selector';
import React from 'react';
import StockChart from "@/components/stocks/stock-chart";

export default function StocksPage() {
    return (
        <div>
            <StockSelector />
            <StockChart />
        </div>
    );
}