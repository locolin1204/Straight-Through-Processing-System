'use client'

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '../ui/button';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { callModifyBalanceApi, getUserDetails } from "@/app/service/home-service";
import LoadingCircle from "@/components/loading-circle";
import { ModifyBalanceUser } from "@/definition";


export default function PersonalInfoCard() {
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [cash, setCash] = useState(0);

    const [amount, setAmount] = useState(0);

    const balance = 343971.12
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)

    useEffect(() => {
        setIsLoading(true);
        (async () => {
            console.log("you: ",envUserId);
            const data = await getUserDetails(envUserId);
            setName(data.name);
            setCash(data.cash);
            setIsLoading(false);
        })()

    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleWithdraw = (e: any) => {
        e.preventDefault();
        const modifyBalanceUser: ModifyBalanceUser = {
            id: envUserId,
            amount: amount
        }
        // await callModifyBalanceApi(modifyBalanceUser);
    }



    return (
        <Card className="mx-auto m-10 flex-1">
            {isLoading ? (
                <LoadingCircle />
            ) : (
                <>
                    <CardHeader>
                        <CardTitle>Hello, {name} 👋 </CardTitle>
                        <CardDescription>
                            Check your balance below
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-5">
                            <div>
                                <Label className="text-muted-foreground text-sm">Balance</Label>
                                <p className="leading-none font-semibold">$ {balance.toLocaleString()}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm">Cash</Label>
                                <p className="leading-none font-semibold">$ {cash.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 pt-20">
                            <div className="grid gap-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="100000"
                                    required
                                    value={amount}
                                    onChange={handleAmountChange}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <Button variant="outline" className="dark:border-green-500 flex-1">
                                    Deposit
                                </Button>
                                <Button variant="outline"  className="dark:border-red-500 flex-1" onClick={handleWithdraw}>
                                    Withdraw
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </>
            ) }

        </Card>
    );
}