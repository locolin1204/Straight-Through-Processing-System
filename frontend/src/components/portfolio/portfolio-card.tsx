'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import LabelNumber from "@/components/label-number";
import { getUserDetails } from "@/app/service/home-service";
import { CurrentHolding, LiveStockData } from "@/definition";
import { useDateContext } from "@/contexts/date-context";
import { getCurrentHoldings } from "@/app/service/portfolio-service";
import { calMarketPrice, formatNumber } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { clsx } from "clsx";

export default function PortfolioCard() {
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_HOST

    const { userSelectedDate, currentTime } = useDateContext();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [cash, setCash] = useState(0);
    const [totalInventory, setTotalInventory] = useState(0)
    const [stockOwned, setStockOwned] = useState<CurrentHolding[]>([])
    const [unrealizedPnl, setUnrealizedPnl] = useState<number>(0)
    const [balance, setBalance] = useState<number>(0)


    useEffect(() => {
        setBalance(unrealizedPnl + cash)
    }, [cash, unrealizedPnl]);

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            try {
                const [holdingsData, userData] = await Promise.all([
                    getCurrentHoldings(envUserId),
                    getUserDetails(envUserId)
                ]);
                const appendStock: CurrentHolding[] = []
                console.log("holdingsData", holdingsData);
                holdingsData.forEach((item) => {
                    setTotalInventory(totalInventory + (item.averagePrice * item.quantity))
                    appendStock.push(item)
                })
                console.log("appendStock", appendStock);
                setStockOwned(appendStock)
                console.log("stockOwned", stockOwned);
                setName(userData.name);
                setCash(userData.cash);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        setIsLoading(true);

        // Fetch initial holdings
        if (!currentTime) return;

        const eventSource = new EventSource(`${envUrl}/livestock/stream/all/${currentTime.toISOString()}`);

        eventSource.onmessage = (event) => {
            try {
                const newPrices: LiveStockData[] = JSON.parse(event.data);
                let priceChange = 0
                newPrices.forEach((item) => {
                    stockOwned.forEach((eachStock) => {
                        console.log("eachStock", eachStock);
                        if (eachStock.ticker == item.ticker) {
                            const { close, high, low } = item;
                            console.log("close, high, low", close, high, low);
                            const marketPrice = calMarketPrice(high, low, close);
                            priceChange += ((marketPrice - eachStock.averagePrice) * eachStock.quantity);
                        }
                    })
                    // if(stockOwned.includes(item.ticker))
                })
                setUnrealizedPnl(priceChange)
                setIsLoading(false);
                // console.log("stockPrices", stockPrices)
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = () => {
            console.error('SSE error occurred');
            setIsLoading(false);
            eventSource.close();
        };

        // Cleanup on component unmount
        return () => {
            setIsLoading(false);

            eventSource.close();
        };
    }, [userSelectedDate, stockOwned]);

    // const balance: number = useMemo(() => {
    //     return initBalance + cash
    // }, [cash]);

    return (
        <Card className="mx-10 h-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row gap-1">
                        <User size={16}/>
                        <p>Portfolio</p>
                    </div>
                </CardTitle>
                <CardDescription>
                    Check your portfolio below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row gap-20">
                    <div className="flex flex-row gap-20">
                        <div className="w-40">
                            <LabelNumber label="Balance" formattedNumber={`$ ${formatNumber(balance)}`}/>
                        </div>
                        <div className="w-40">
                            <LabelNumber label="Cash" formattedNumber={`$ ${formatNumber(cash)}`}/>
                        </div>
                        <div className="w-40">
                                <Label className="text-muted-foreground text-sm">Unrealized P&L</Label>
                                <p className={clsx(
                                    "leading-none font-semibold",
                                    unrealizedPnl > 0 ? 'text-green-500' : 'text-destructive'
                                )}>{`$ ${formatNumber(unrealizedPnl)}`}</p>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}