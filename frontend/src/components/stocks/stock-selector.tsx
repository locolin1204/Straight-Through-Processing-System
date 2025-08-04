'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Ticker } from "@/definition";
import StockChart from "@/components/stocks/stock-chart";
import { Label } from "@/components/ui/label";

export default function StockSelector({ allTickers }: { allTickers: Array<Ticker> }) {
    const [tickers, setTickers] = useState(allTickers || []);
    useEffect(() => {
        setTickers(allTickers);
    }, [allTickers]);

    const [selectedTicker, setselectedTicker] = React.useState(allTickers[0])

    return (
        <div className="flex flex-row">
            <div className="flex flex-col justify-start w-1/4 h-screen dark:bg-popover rounded-none">
                <Label className="text-foreground/80 text-lg font-light p-5">Stocks</Label>
                {tickers.map((ticker) => (
                    <Button variant="outline" className={clsx(
                        "border-0 rounded-none w-full cursor-pointer dark:bg-popover py-5 text-base",
                        { "border-l-2 dark:bg-muted dark:border-muted-foreground font-semibold": ticker === selectedTicker }
                    )} key={ticker.ticker}
                            onClick={() => setselectedTicker(ticker)}>
                        {ticker.ticker}
                    </Button>
                ))}
            </div>
            <StockChart selectedTicker={selectedTicker}/>
        </div>

    );
}