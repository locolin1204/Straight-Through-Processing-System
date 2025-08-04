'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";
import { Newspaper } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useDateContext } from "@/contexts/date-context";
import { getLatestNews } from "@/app/service/home-service";
import { News } from "@/definition";
import LoadingCircle from "@/components/loading-circle";
import { format, subHours } from "date-fns";

export default function NewsCard() {
    const [isLoading, setIsLoading] = useState(true);
    const [news, setNews] = React.useState<News[]>([]);
    const { date } = useDateContext()


    useEffect(() => {
        setIsLoading(true);
        if (!date) return;
        const fetchData = async () => {
            const data = await getLatestNews(date);
            console.log("news: ", data);
            setNews(data);
            setIsLoading(false);
        };
        fetchData();
    }, [date]);

    const tickerSentiment = [
        "Bullish",
        "Somewhat-Bullish",
        'Bearish',
        'Somewhat-Bearish',
        'Neutral'
    ]
    return (
        <Card className="flex-1 mr-10 h-[50vh]">
            {isLoading ? (
                <LoadingCircle/>
            ) : (
                <>
                    <CardHeader>
                        <CardTitle>
                            <div className="flex flex-row gap-1">
                                <Newspaper size={16}/>
                                <p>News</p>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            <p className="pb-2">Reference labels</p>
                            <div className="flex flex-row gap-1">
                                {tickerSentiment.map((item, i) => (
                                    <Badge key={item} className={clsx(
                                        'text',
                                        {
                                            'bg-red-500 text-white': item === 'Bullish',
                                            'bg-red-200 text-black': item === 'Somewhat-Bullish',
                                            'bg-sky-500 text-white': item === 'Bearish',
                                            'bg-sky-200 text-black': item === 'Somewhat-Bearish',
                                            'bg-white text-black': item === 'Neutral',
                                        }
                                    )}
                                    >{item}</Badge>
                                ))}
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <div className="mx-5">
                        <Separator/>
                    </div>
                    <CardContent>
                        {/* News Column */}
                        <ScrollArea className="h-[30vh] border-t-[0.5] rounded-xl">
                            <div className=" flex flex-col gap-2">
                                {news.map((item, i) => (
                                    <Card key={i}>
                                        <CardHeader>
                                            <div className="flex flex-row gap-1 pb-2">
                                                {item.topics.map((item, i) => (
                                                    <Badge variant="secondary" key={i}>{item.topic}</Badge>
                                                ))}
                                            </div>
                                            <CardTitle>{item.title}</CardTitle>
                                            <CardDescription>
                                                {format(subHours(item.timePublished * 1000, 8), 'dd MMM yyyy HH:mm')}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-row gap-1 pb-2">
                                                {item.tickerSentimentList.length != 0 && item.tickerSentimentList.map(
                                                    (item, i) => {
                                                        const label = item.ticker_sentiment_label
                                                        return (
                                                            <Badge
                                                                key={i}
                                                                className={clsx(
                                                                    'text-base',
                                                                    {
                                                                        'bg-red-500 text-white': label === 'Bullish',
                                                                        'bg-red-200 text-black': label === 'Somewhat-Bullish',
                                                                        'bg-sky-500 text-white': label === 'Bearish',
                                                                        'bg-sky-200 text-black': label === 'Somewhat-Bearish',
                                                                        'bg-white text-black': label === 'Neutral',
                                                                    }
                                                                )}
                                                            >{item.ticker}</Badge>
                                                        )
                                                    })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </>)}
        </Card>
    );
}