import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { CandlestickChartIcon, Newspaper } from "lucide-react";
import StockTable from "@/components/home/stock-table";

export default function StocksCard() {

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
                    Check your balance below
                </CardDescription>
            </CardHeader>
            <CardContent>

                <div className="flex flex-row gap-20">
                   <StockTable />
                   <StockTable />
                </div>

            </CardContent>
        </Card>
    );
}