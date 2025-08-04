'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, CandlestickChartIcon } from "lucide-react";
import StockTable from "@/components/home/stock-table";
import { StockTableProps, StockTableTickerProps } from "@/definition";
import { getAllClosestPreviousHistoricalData, getCurrentLiveData } from "@/app/service/home-service";
import { useDateContext } from "@/contexts/date-context";
import { calMarketPrice, calPercentageChange } from "@/lib/utils";
import LoadingCircle from "@/components/loading-circle";

export default function StocksCard() {
    const { date } = useDateContext();

    const [risingTableProps, setRisingTableProps] = useState<StockTableProps>();
    const [droppingTableProps, setDroppingTableProps] = useState<StockTableProps>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        if (!date) return;

        const fetchAndProcessData = async () => {
            const [historicalData, liveData] = await Promise.all([
                getAllClosestPreviousHistoricalData(date),
                getCurrentLiveData(date),
            ]);

            const processedList: StockTableTickerProps[] = historicalData.flatMap(historical => {
                const match = liveData.find(cur => cur.ticker === historical.ticker);
                if (!match) return [];

                const marketPrice = calMarketPrice(match.high, match.low, match.close);
                const percentageChange = calPercentageChange(marketPrice, historical.close);

                return [{
                    ticker: historical.ticker,
                    percentage: percentageChange,
                    curPrice: marketPrice,
                }];
            });

            const rising: StockTableTickerProps[] = processedList
                .filter(item => item.percentage > 0)
                .sort((a, b) => b.percentage - a.percentage)

            const dropping: StockTableTickerProps[] = processedList
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
        };
        setIsLoading(false);
        fetchAndProcessData();
    }, [date]);

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
                        <LoadingCircle />
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