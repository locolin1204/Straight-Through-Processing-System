import React from 'react';
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

export default function PersonalInfoCard() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Hello, User</CardTitle>
                {/*<CardDescription>*/}
                {/*    Enter your email below to login to your account*/}
                {/*</CardDescription>*/}
            </CardHeader>
            <CardContent>
                <p>Investment: $1000</p>
                <p>Cash: $1000</p>
                <p> abc</p>
            </CardContent>
        </Card>
    );
}