import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCandlestick, History } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function CurrentHoldingsCard() {
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
                        <TableRow>
                            <TableCell>AAPL</TableCell>
                            <TableCell className="text-right"> -100</TableCell>
                            <TableCell className="text-right">15</TableCell>
                            <TableCell className="text-right">$ 249.10</TableCell>
                            <TableCell className="text-right">$ 2350.00</TableCell>
                            <TableCell className="text-center w-24">
                                <Button variant="outline" className="cursor-pointer w-full">Sell</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableCaption>A list of you current holdings.</TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}