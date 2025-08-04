'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCandlestick, History } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getUserDetails } from "@/app/service/home-service";
import { getCurrentHoldings } from "@/app/service/portfolio-service";
import { TradeRecord } from "@/definition";
import { formatNumber } from "@/lib/utils";

export default function CurrentHoldingsCard() {
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)

    const [isLoading, setIsLoading] = useState(true);
    const [curHoldings, setCurHoldings] = useState<Array<TradeRecord>>([])

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const data = await getCurrentHoldings(envUserId);
            setCurHoldings(data);
            setIsLoading(false);
        })()

    }, []);

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
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="">Ticker</TableHead>
                            <TableHead className="text-right">Unrealised Gain / Loss</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Average Share Price</TableHead>
                            <TableHead className="text-right">Total Price</TableHead>
                            <TableHead className="text-left"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            curHoldings.map((holding)=> (
                                <TableRow key={holding.id}>
                                    <TableCell>{holding.ticker}</TableCell>
                                    <TableCell className="text-right">//</TableCell>
                                    <TableCell className="text-right">{holding.quantity}</TableCell>
                                    <TableCell className="text-right">$ {formatNumber(holding.pricePerShare)}</TableCell>
                                    <TableCell className="text-right">$ {formatNumber(holding.pricePerShare*holding.quantity)}</TableCell>
                                    <TableCell className="text-center w-24">
                                        <Button variant="outline" className="cursor-pointer w-full">Sell</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                    <TableCaption>A list of you current holdings.</TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}