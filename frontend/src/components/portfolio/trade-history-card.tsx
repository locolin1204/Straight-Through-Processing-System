'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TradeRecord } from "@/definition";
import { getCurrentHoldings, getTradeHistory } from "@/app/service/portfolio-service";
import { capitalizeFirstLetter, formatDate, formatNumber } from "@/lib/utils";

export default function TradeHistoryCard() {
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)

    const [isLoading, setIsLoading] = useState(true);
    const [tradeHistory, setTradeHistory] = useState<Array<TradeRecord>>([])

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const data = await getTradeHistory(envUserId);
            setTradeHistory(data.sort((a, b) => b.tradeTimestamp - a.tradeTimestamp));
            setIsLoading(false);
        })()

    }, []);

    const rows = [
        {}
    ]

    return (
        <Card className="mx-10 h-full">
            <CardHeader>
                <CardTitle>
                    <div className="flex flex-row gap-1">
                        <History size={16}/>
                        <p>Trade History</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Trade Date</TableHead>
                            <TableHead className="">Ticker</TableHead>
                            <TableHead className="text-right">Gain / Loss</TableHead>
                            <TableHead className="text-right">Buy / Sell</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price Per Share</TableHead>
                            <TableHead className="text-right">Total Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tradeHistory.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell>{formatDate(trade.tradeTimestamp)}</TableCell>
                                <TableCell>{trade.ticker}</TableCell>
                                <TableCell className="text-right">{trade.pnl}</TableCell>
                                <TableCell className="text-right">{capitalizeFirstLetter(trade.tradeType)}</TableCell>
                                <TableCell className="text-right">{trade.quantity}</TableCell>
                                <TableCell className="text-right">$ {formatNumber(trade.pricePerShare)}</TableCell>
                                <TableCell className="text-right">$ {formatNumber(trade.pricePerShare*trade.quantity)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>A list of your recent transactions.</TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}