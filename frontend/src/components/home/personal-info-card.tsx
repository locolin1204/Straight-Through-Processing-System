'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { clsx } from "clsx";


export default function PersonalInfoCard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [name, setName] = useState("");
    const [cash, setCash] = useState(0);

    const [amount, setAmount] = useState(100);

    const initBalance = 343971.12
    const envUserId = Number(process.env.NEXT_PUBLIC_USER_ID)

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

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleDepositOrWithdraw= async (e: React.FormEvent, isDeposit: boolean) => {
        e.preventDefault();

        isDeposit ? setIsDepositing(true) : setIsWithdrawing(true);
        isDeposit ? setFlashColor("green") : setFlashColor("red");

        const modifyBalanceUser: ModifyBalanceUser = {
            id: envUserId,
            amount: isDeposit ? amount : -amount,
        };

        try {
            const newCash = await callModifyBalanceApi(modifyBalanceUser);
            setCash(newCash);
        } catch (error) {
            console.error("Withdrawal failed:", error);
        }

        isDeposit ? setIsDepositing(false) : setIsWithdrawing(false);
    };


    const [flashColor, setFlashColor] = useState("none"); // Can be 'green', 'red', or null
    const prevCashRef = useRef(cash); // Store the previous cash value

    useEffect(() => {
        if (cash !== prevCashRef.current) {
            if (flashColor) {
                const timer = setTimeout(() => {
                    setFlashColor("none"); // End the flash after 1 second
                }, 500); // 1000 milliseconds = 1 second

                // Cleanup the timer if the component unmounts or cash changes again
                return () => clearTimeout(timer);
            }
            // Update the ref to the current cash value for the next comparison
            prevCashRef.current = cash;
        }
    }, [cash]);

    return (
        <Card className="flex-1 ml-10">
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
                                <p className={clsx(
                                    "leading-none font-semibold", // Always applied classes
                                    "transition-colors duration-200 ease-out", // Smooth transition over 1 second
                                    {
                                        "text-green-500": flashColor === 'green', // Apply green when increased
                                        "text-red-500": flashColor === 'red',   // Apply red when decreased
                                        "text-white": flashColor === "none"    // Default color when not flashing
                                    }
                                )}>$ {balance.toLocaleString()}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-sm">Cash</Label>
                                {/*<p className="leading-none font-semibold">$ {cash.toLocaleString()}</p>*/}
                                <p className={clsx(
                                    "leading-none font-semibold", // Always applied classes
                                    "transition-colors duration-200 ease-out", // Smooth transition over 1 second
                                    {
                                        "text-green-500": flashColor === 'green', // Apply green when increased
                                        "text-red-500": flashColor === 'red',   // Apply red when decreased
                                        "text-white": flashColor === "none"    // Default color when not flashing
                                    }
                                )}
                                >
                                    $ {cash.toLocaleString()}
                                </p>
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
                                <Button variant="outline" className="dark:border-green-500 flex-1 cursor-pointer" onClick={(e) => handleDepositOrWithdraw(e, true)}>
                                    {isDepositing ? <LoadingCircle/>  : <>Deposit</> }
                                </Button>
                                <Button variant="outline"  className="dark:border-red-500 flex-1 cursor-pointer" onClick={(e) => handleDepositOrWithdraw(e, false)}>
                                    {isWithdrawing ? <LoadingCircle/>  : <>Withdraw</> }
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </>
            ) }

        </Card>
    );
}