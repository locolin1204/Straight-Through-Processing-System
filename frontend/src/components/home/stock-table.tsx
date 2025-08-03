import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ArrowUpWideNarrow } from "lucide-react";

export default function StockTable() {
    return (
        <div className="flex flex-col gap-5 w-full">
            <Label className="flex flex-row text-green-300">
                <ArrowUpWideNarrow/>
                <p>Top Rising Stocks</p>
            </Label>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Ticker</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">APPL</TableCell>
                        <TableCell>+100%</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}