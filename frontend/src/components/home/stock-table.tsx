import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { StockTableProps } from "@/definition";
import { getSignFromNumber } from "@/lib/utils";

export default function StockTable(
    { stockTableProps }: {stockTableProps: StockTableProps},
) {
    return (
        <div className="flex flex-col gap-5 w-full">
            <Label className="flex flex-row ">
                {stockTableProps.icon}
                <p>{stockTableProps.tableName}</p>
            </Label>
            <Table>
                <TableCaption>{stockTableProps.desc}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Ticker</TableHead>
                        <TableHead className="">Price</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockTableProps.tickers.map((ticker) => (
                        <TableRow key={ticker.ticker}>
                            <TableCell className="font-medium">{ticker.ticker}</TableCell>
                            <TableCell className="">$ {ticker.curPrice.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{getSignFromNumber(ticker.percentage)}{ticker.percentage.toLocaleString()} %</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}