'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCandlestick, History } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "@/app/service/home-service";
import { getCurrentHoldings, sellTrade } from "@/app/service/portfolio-service";
import { CurrentHolding, LiveStockData, SellTradeRequest, TradeRecord, TradeRecordBody } from "@/definition";
import { calMarketPrice, formatNumber } from "@/lib/utils";
import { useDateContext } from "@/contexts/date-context";
import { Skeleton } from "@/components/ui/skeleton";
import { createTrade } from "@/app/service/stock-service";
import { toast } from "sonner";
import LoadingCircle from "@/components/loading-circle";
import { useRouter } from "next/navigation";

export default function CurrentHoldingsCard() {
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

    const { userSelectedDate, currentTime } = useDateContext();
    const [isLoading, setIsLoading] = useState(true);
    const [curHoldings, setCurHoldings] = useState<Array<CurrentHolding>>([])
    const [stockPrices, setStockPrices] = useState<Map<String, LiveStockData>>(new Map());
    const [isSellingTrade, setIsSellingTrade] = useState(false);

    const router = useRouter();
    useEffect(() => {
        (async () => {
            const data = await getCurrentHoldings(envUserId);
            setCurHoldings(data);
        })()

    }, [isSellingTrade]);

    const handleSellTradeRecord = async (e: React.FormEvent, holding: CurrentHolding) => {

        const marketPrice = calMarketPrice(stockPrices.get(holding.ticker)!.high, stockPrices.get(holding.ticker)!.low, stockPrices.get(holding.ticker)!.close)

        setIsSellingTrade(true);
        e.preventDefault();

        const sellTradeRequest: SellTradeRequest = {
            userId: envUserId,
            ticker: holding.ticker,
            marketPrice: marketPrice
        };

        try {
            console.log("BuyTrade", sellTradeRequest);
            const tradeRes = await sellTrade(sellTradeRequest);
            toast.success("Trade Sold", {
                description: `Sold ${holding.ticker} shares at $${formatNumber(marketPrice)}`,
                // action: {
                //     label: "Check out portfolio",
                //     onClick: () => router.push('/portfolio'),
                // },
            })
            // console.log("Finish buy trade", tradeRes);
            setIsSellingTrade(false);
            if (window.location.pathname === '/portfolio') {
                window.location.reload();
            } else {
                // If not on the portfolio page, you might want to redirect.
                router.push('/portfolio');
            }
        } catch (error) {
            setIsSellingTrade(false);
            console.error("Withdrawal failed:", error);
        }
    }


    useEffect(() => {
        setIsLoading(true);

        // Fetch initial holdings
        if (!currentTime) return;

        const eventSource = new EventSource(`${envUrl}/livestock/stream/all/${currentTime.toISOString()}`);

        eventSource.onmessage = (event) => {
            try {
                const newPrices: LiveStockData[] = JSON.parse(event.data);
                // console.log("newPrices", newPrices)

                setStockPrices(
                    new Map(newPrices.map(item => [item.ticker, item]))
                )
                setIsLoading(false);
                // console.log("stockPrices", stockPrices)
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = () => {
            console.error('SSE error occurred');
            eventSource.close();
        };

        // Cleanup on component unmount
        return () => {
            setIsLoading(false);

            eventSource.close();
        };
    }, [userSelectedDate]);

    function calculateGainLoss(curHold: CurrentHolding) {
        const ticker = curHold?.ticker;
        const sp: LiveStockData | undefined = stockPrices.get(ticker)
        if (!sp) return 0;
        const marketPrice = calMarketPrice(sp.high, sp.low, sp.close)
        return (marketPrice - curHold.averagePrice) * curHold.quantity;
    }


    return (
        <Card className="mx-10 h-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row gap-1">
                        <ChartCandlestick size={16}/>
                        <p>Current Holdings</p>
                    </div>
                </CardTitle>
            </CardHeader>
            {isLoading ? (
                    <div className="px-5 space-y-3 w-full flex-1 ">
                        <Skeleton className="bg-muted-foreground h-8 w-1/2"/>
                        <Skeleton className="bg-muted-foreground h-4 w-full"/>
                        <Skeleton className="bg-muted-foreground h-4 w-full"/>
                    </div>
                ) :
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Ticker</TableHead>
                                <TableHead className="text-right">Current Market Price</TableHead>
                                <TableHead className="text-right">Total Unrealised Gain / Loss</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Average Buy Price</TableHead>
                                <TableHead className="text-right">Total Buy Price</TableHead>
                                <TableHead className="text-left"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                curHoldings.map((holding) => (
                                    <TableRow key={holding.ticker}>
                                        <TableCell>{holding.ticker}</TableCell>
                                        <TableCell className="text-right">$ {formatNumber(calMarketPrice(stockPrices.get(holding.ticker)!.high, stockPrices.get(holding.ticker)!.low, stockPrices.get(holding.ticker)!.close))}</TableCell>
                                        <TableCell className={`text-right ${calculateGainLoss(
                                            holding) > 0 ? 'text-green-500' : 'text-destructive'}`}>$ {stockPrices && formatNumber(
                                            calculateGainLoss(
                                                holding))}</TableCell>
                                        <TableCell className="text-right">{holding.quantity}</TableCell>
                                        <TableCell className="text-right">$ {formatNumber(
                                            holding.averagePrice)}</TableCell>
                                        <TableCell className="text-right">$ {formatNumber(
                                            holding.averagePrice * holding.quantity)}</TableCell>
                                        <TableCell className="text-center w-24">
                                            <Button variant="outline"
                                                    className="cursor-pointer w-full"
                                                    onClick={(e) => handleSellTradeRecord(e, holding)}
                                            >
                                                {
                                                     isSellingTrade   ? <LoadingCircle /> : <>Sell</>
                                                }</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        <TableCaption>A list of you current holdings.</TableCaption>
                    </Table>
                </CardContent>
            }
        </Card>
    );
}