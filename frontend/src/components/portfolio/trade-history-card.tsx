import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TradeHistoryCard() {

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
                        <TableRow>
                            <TableCell>2025 Aug 1</TableCell>
                            <TableCell>AAPL</TableCell>
                            <TableCell className="text-right"> -100</TableCell>
                            <TableCell className="text-right">Buy</TableCell>
                            <TableCell className="text-right">15</TableCell>
                            <TableCell className="text-right">$ 249.10</TableCell>
                            <TableCell className="text-right">$ 2350.00</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableCaption>A list of your recent transactions.</TableCaption>
                </Table>
            </CardContent>
        </Card>
    );
}