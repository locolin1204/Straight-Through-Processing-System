'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { clsx } from "clsx";
import { Newspaper } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function NewsCard() {
    const news = [
        {
            "title": "Google's Circle to Search may soon add QR and barcode scanning: Report",
            "time_published": "20250701T062006",
            "topics": [
                {
                    "topic": "Technology"
                }
            ],
            "ticker_sentiment": [
                {
                    "ticker": "GOOG",
                    "ticker_sentiment_label": "Bullish"
                }
            ]
        },
        {
            "title": "Alphabet (GOOGL) enhances Google TV with new FAST channels.",
            "time_published": "20250701T143900",
            "topics": [
                {
                    "topic": "Earnings",
                },
                {
                    "topic": "Technology",
                },
                {
                    "topic": "Retail & Wholesale",
                }
            ],
            "ticker_sentiment": [
                {
                    "ticker": "MSFT",
                    "ticker_sentiment_label": "Neutral"
                },
                {
                    "ticker": "GOOG",
                    "ticker_sentiment_label": "Bullish"
                }
            ]
        },
        {
            "title": "Google Buys Part of Taiwan Solar Firm New Green Power, Owned by BlackRock.",
            "time_published": "20250701T035949",
            "topics": [
                {
                    "topic": "Technology",
                },
                {
                    "topic": "Finance",
                },
                {
                    "topic": "Financial Markets",
                }
            ],
            "ticker_sentiment": [
                {
                    "ticker": "GOOG",
                    "ticker_sentiment_label": "Bullish"
                }
            ]
        },
        {
            "title": "Google Buys Part of Taiwan Solar Firm New Green Power, Owned by BlackRock.",
            "time_published": "20250701T035949",
            "topics": [
                {
                    "topic": "Technology",
                },
                {
                    "topic": "Finance",
                },
                {
                    "topic": "Financial Markets",
                }
            ],
            "ticker_sentiment": [
                {
                    "ticker": "GOOG",
                    "ticker_sentiment_label": "Bullish"
                }
            ]
        },
    ]

    const tickerSentiment = [
        "Bullish",
        "Somewhat-Bullish",
        'Bearish',
        'Somewhat-Bearish',
        'Neutral'
    ]
    return (
        <Card className="flex-1 mr-10">
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
                                    'bg-green-500 text-white': item === 'Bullish',
                                    'bg-green-200 text-black': item === 'Somewhat-Bullish',
                                    'bg-red-500 text-white': item === 'Bearish',
                                    'bg-red-200 text-black': item === 'Somewhat-Bearish',
                                    'bg-white text-black': item === 'Neutral',
                                }
                            )}
                            >{item}</Badge>
                        ))}
                    </div>
                </CardDescription>
            </CardHeader>
            <div className="mx-5">
            <Separator />
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
                                        {item.time_published}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row gap-1 pb-2">
                                        {item.ticker_sentiment.map((item, i) => (
                                            <Badge
                                                key={i}
                                                className={clsx(
                                                    'text-base',
                                                    {
                                                        'bg-green-500 text-white': item.ticker_sentiment_label === 'Bullish',
                                                        'bg-green-200 text-black': item.ticker_sentiment_label === 'Somewhat-Bullish',
                                                        'bg-red-500 text-white': item.ticker_sentiment_label === 'Bearish',
                                                        'bg-red-200 text-black': item.ticker_sentiment_label === 'Somewhat-Bearish',
                                                        'bg-white text-black': item.ticker_sentiment_label === 'Neutral',
                                                    }
                                                )}
                                            >{item.ticker}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}