import StockSelector from '@/components/stocks/stock-selector';
import React from 'react';
import { getAllTickers } from "@/app/service/stock-service";

export default async function StocksPage() {

    // const [tickerList, setTickerList] = React.useState([]);

    const allTickers = await getAllTickers()
    return (
        <div>
            <StockSelector initialTickers={allTickers} />
        </div>
    );
}