'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, CandlestickChartIcon } from "lucide-react";
import StockTable from "@/components/home/stock-table";
import { StockTableProps, StockTableTickerProps } from "@/definition";
import { useDateContext } from "@/contexts/date-context";
import { calMarketPrice, calPercentageChange } from "@/lib/utils";
import LoadingCircle from "@/components/loading-circle";
import { Skeleton } from "@/components/ui/skeleton";

export default function StocksCard() {
    const { userSelectedDate, currentTime } = useDateContext();

    const [risingTableProps, setRisingTableProps] = useState<StockTableProps>();
    const [droppingTableProps, setDroppingTableProps] = useState<StockTableProps>();
    const [isLoading, setIsLoading] = useState(true);
    const referencePricesRef = useRef<{ [ticker: string]: number }>({});

    const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

    useEffect(() => {
        setIsLoading(true);
        if (!currentTime) return;

        // Reset reference prices when the date changes
        referencePricesRef.current = {};

        const eventSource = new EventSource(`${envUrl}/livestock/stream/all/${currentTime?.toISOString()}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.length === 0) return;

            const timestamp = data[0].timestamp;
            if (timestamp > currentTime) return;

            const newStockData: StockTableTickerProps[] = data.map((stock:any) => {
                const { ticker, close, high, low } = stock;
                if (!referencePricesRef.current[ticker]) {
                    referencePricesRef.current[ticker] = close;
                }
                const marketPrice = calMarketPrice(high, low, close);
                const percentage = calPercentageChange(marketPrice, referencePricesRef.current[ticker]);
                return { ticker, curPrice: marketPrice, percentage };
            });

            const rising = newStockData
                .filter(item => item.percentage > 0)
                .sort((a, b) => b.percentage - a.percentage);

            const dropping = newStockData
                .filter(item => item.percentage < 0)
                .sort((a, b) => a.percentage - b.percentage);

            setRisingTableProps({
                tableName: "Top Rising Stock",
                icon: <ArrowUpWideNarrow className="text-green-500" />,
                desc: "Today's rising stocks",
                tickers: rising,
            });

            setDroppingTableProps({
                tableName: "Top Dropping Stock",
                icon: <ArrowDownWideNarrow className="text-destructive" />,
                desc: "Today's dropping stocks",
                tickers: dropping,
            });

            setIsLoading(false);
        };

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            setIsLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [userSelectedDate]);

    return (
        <Card className="mx-10 h-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row gap-1">
                        <CandlestickChartIcon size={16}/>
                        <p>Stocks</p>
                    </div>
                </CardTitle>
                <CardDescription>
                    Check out the today's performances of stocks.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    isLoading || !risingTableProps || !droppingTableProps ? (
                            // <LoadingCircle />
                        <div className="flex flex-row gap-30 justify-between">
                            <div className="space-y-3 w-1/4 flex-1 ">
                                <Skeleton className="bg-muted-foreground h-8 w-3/4"/>
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                            </div>
                            <div className="space-y-3 w-1/4 flex-1">
                                <Skeleton className="bg-muted-foreground h-8 w-3/4"/>
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                            </div>
                        </div>
                        ) :
                        <div className="flex flex-row gap-20">
                            <StockTable stockTableProps={risingTableProps} />
                            <StockTable stockTableProps={droppingTableProps} />
                        </div>
                }
            </CardContent>
        </Card>
    );
}