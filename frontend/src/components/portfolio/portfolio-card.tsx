'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import LabelNumber from "@/components/label-number";
import { getUserDetails } from "@/app/service/home-service";

export default function PortfolioCard() {
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [cash, setCash] = useState(0);
    const initBalance = 343971.12

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            const data = await getUserDetails(envUserId);
            setName(data.name);
            setCash(data.cash);
            setIsLoading(false);
        })()
    }, []);
    const balance: number = useMemo(() => {
        return initBalance + cash
    }, [cash]);

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
                        <LabelNumber label="Balance" formattedNumber={balance.toLocaleString()}/>
                        <LabelNumber label="Cash" formattedNumber={cash.toLocaleString()}/>
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