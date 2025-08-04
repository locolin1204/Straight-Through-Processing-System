import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import LabelNumber from "@/components/label-number";

export default function PortfolioCard() {
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
                <div className="flex flex-col gap-3">
                    <LabelNumber label="Balance" formattedNumber="100"/>
                    <LabelNumber label="Cash" formattedNumber="100"/>
                </div>
                <div className="flex flex-col gap-3">
                    <LabelNumber label="Realized P&L" formattedNumber="100"/>
                    <LabelNumber label="Unrealized P&L" formattedNumber="100"/>
                </div>
                </div>

            </CardContent>
        </Card>
    );
}