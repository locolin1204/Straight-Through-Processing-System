'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { Ticker } from "@/definition";
import StockChart from "@/components/stocks/stock-chart";
import { Label } from "@/components/ui/label";

export default function StockSelector({ initialTickers }: { initialTickers: Array<Ticker> }) {
    const [tickers, setTickers] = useState(initialTickers || []);
    useEffect(() => {
        setTickers(initialTickers);
    }, [initialTickers]);

    const [selected, setSelected] = React.useState("AAPL")

    return (
        <div className="flex flex-row">
            <div className="rounded-md flex flex-col justify-center w-1/4 h-screen dark:bg-black border">
                {tickers.map((ticker) => (
                    <Button variant="outline" className={clsx(
                        "border-0 rounded-none w-full cursor-pointer",
                        { "border-l-2 dark:bg-input/90 dark:border-muted-foreground font-semibold": ticker.ticker === selected }
                    )} key={ticker.ticker}
                            onClick={() => setSelected(ticker.ticker)}>
                        {ticker.ticker}
                    </Button>
                ))}
            </div>
            <div className="flex flex-col w-full">
                <Label>{selected}</Label>
                <StockChart selectedTicker={selected} />
            </div>
        </div>

    );
}