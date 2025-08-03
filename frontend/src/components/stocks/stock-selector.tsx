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
            <div className="rounded-md flex flex-col justify-center w-1/4 h-screen dark:bg-popover border rounded-none">
                {tickers.map((ticker) => (
                    <Button variant="outline" className={clsx(
                        "border-0 rounded-none w-full cursor-pointer dark:bg-popover py-7 text-base",
                        { "border-l-2 dark:bg-input/90 dark:border-muted-foreground font-semibold": ticker === selectedTicker }
                    )} key={ticker.ticker}
                            onClick={() => setselectedTicker(ticker)}>
                        {ticker.ticker}
                    </Button>
                ))}
            </div>
            <div className="flex flex-col w-full p-10">
                <div className="flex flex-col w-full pb-10">
                    <Label className="text-muted-foreground text-sm">{selectedTicker.ticker}</Label>
                    <p className={clsx(
                        "leading-none font-semibold", // Always applied classes
                        "transition-colors duration-200 ease-out", // Smooth transition over 1 second
                    )}>{selectedTicker.name}</p>
                </div>
                <StockChart selectedTicker={selectedTicker}/>
            </div>
        </div>

    );
}