"use client";

import {
    CandlestickData,
    CandlestickSeries,
    ColorType,
    createChart,
    HistogramData,
    HistogramSeries,
    IChartApi,
    ISeriesApi,
    UTCTimestamp,
} from 'lightweight-charts';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LabelNumber from "@/components/label-number";
import { Input } from "@/components/ui/input";
import { useDateContext } from "@/contexts/date-context";
import { LiveStockData, Ticker } from "@/definition";
import LoadingCircle from "@/components/loading-circle";
import { Skeleton } from "@/components/ui/skeleton";
import { getClosestPreviousHistoricalData } from "@/app/service/stock-service";
import { calMarketPrice, calPercentageChange, getSignFromNumber, isPositive } from "@/lib/utils";
import { clsx } from "clsx";

// Define a type for your data structure for clarity


export default function StockChart({ selectedTicker }: { selectedTicker: Ticker }) {
    // Refs for the chart and its series
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [previousDayPrice, setPreviousDayPrice] = useState(0);
    const [percentageChange, setPercentageChange] = useState(0);
    const [marketPrice, setMarketPrice] = useState(0);
    const { date } = useDateContext();

    const chartHeight = 600

    const [details, setDetails] = useState({
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
    });

    useMemo(() => {
        const per = calPercentageChange(details.close, previousDayPrice).toFixed(2)
        setPercentageChange(parseFloat(per))
    }, [previousDayPrice, details])

    useMemo(() => {
        setMarketPrice(calMarketPrice(details.high, details.low, details.close))
    }, [details])

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#262626' },
                textColor: 'white',
            },
            height: chartHeight,
            width: chartContainerRef.current.clientWidth,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        seriesRef.current = candlestickSeries;

        const volumeSeries = chart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: '',
        });
        volumeSeriesRef.current = volumeSeries;

        chart.priceScale('').applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function for chart
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Handle data fetching and live stream based on ticker or date change
    useEffect(() => {
        setIsLoading(true);
        console.log("isloading = true:", isLoading)

        // Ensure all required dependencies are available
        if (!date || !selectedTicker || !chartRef.current) {
            return;
        }

        // --- Start Cleanup Logic ---
        // 1. Abort any ongoing fetch requests from the previous ticker
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 2. Close any existing EventSource connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            console.log("Previous EventSource closed.");
        }
        // --- End Cleanup Logic ---

        // Create a new AbortController for the new set of requests
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Clear existing chart data
        seriesRef.current?.setData([]);
        volumeSeriesRef.current?.setData([]);
        setDetails({ open: 0, high: 0, low: 0, close: 0, volume: 0 });

        // Function to fetch historical data
        const fetchHistoricalData = async () => {
            try {
                console.log(`Fetching historical data for ${selectedTicker}`);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/livestock/historical/${selectedTicker.ticker}/${date?.toISOString()}`,
                    { signal: abortController.signal }
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const historicalData: LiveStockData[] = await response.json();

                const candlestickChartData = historicalData.map(d => ({
                    time: d.timestamp, open: d.open, high: d.high, low: d.low, close: d.close
                }));
                const volumeChartData = historicalData.map(d => ({
                    time: d.timestamp, value: d.volume, color: d.close >= d.open ? '#26a69a' : '#ef5350'
                }));


                seriesRef.current?.setData(candlestickChartData);
                volumeSeriesRef.current?.setData(volumeChartData);
                chartRef.current?.timeScale().fitContent();
                console.log("Historical data loaded.");
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log("Historical data fetch aborted.");
                } else {
                    console.error("Could not fetch historical data:", error);
                }
            }
        };


        // Function to connect to the live stream
        const connectToLiveStream = () => {
            console.log(`Connecting to live stream for ${selectedTicker.ticker}`);
            const eventSource = new EventSource(
                `${process.env.NEXT_PUBLIC_BACKEND_HOST}/livestock/stream/${selectedTicker.ticker}/${date?.toISOString()}`);
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => console.log("EventSource connection opened.");


            eventSource.onmessage = (event) => {
                try {
                    const data: LiveStockData = JSON.parse(event.data);
                    const candleData: CandlestickData = {
                        time: data.timestamp, open: data.open, high: data.high, low: data.low, close: data.close,
                    };
                    const volumeData: HistogramData = {
                        time: data.timestamp,
                        value: data.volume,
                        color: data.close >= data.open ? '#26a69a' : '#ef5350',
                    };

                    seriesRef.current?.update(candleData);
                    volumeSeriesRef.current?.update(volumeData);

                    setDetails({ ...candleData, volume: volumeData.value });
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error parsing live data:", error);
                }
            };

            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        };

        getClosestPreviousHistoricalData(selectedTicker, date).then((data) => {
            setPreviousDayPrice(data.adjustedClose)
        });
        // Chain the operations: fetch historical data, then connect to live stream
        fetchHistoricalData().then(() => {
            // Ensure the fetch was not aborted before connecting
            if (!abortController.signal.aborted) {
                connectToLiveStream();
            }
        });

        // The single, most important cleanup function
        return () => {
            console.log(`Cleaning up for ${selectedTicker.ticker}...`);
            abortController.abort();
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };

    }, [selectedTicker, date]); // Re-run this effect when ticker or date changes

    const scrollToRealTime = () => {
        chartRef.current?.timeScale().scrollToRealTime();
    };

    return (
        <div className="flex flex-col w-full p-10 dark:bg-muted">
            <div className="flex flex-row gap-10 items-baseline-last mb-10">
                <div className="flex flex-col">
                    <Label className="text-muted-foreground text-sm">{selectedTicker.ticker}</Label>
                    <p className={clsx(
                        "leading-none font-semibold", // Always applied classes
                        "transition-colors duration-200 ease-out", // Smooth transition over 1 second
                    )}>{selectedTicker.name}</p>
                </div>
                <>
                    {
                        isLoading ? (
                            <div className="space-y-3 w-1/4 ">
                                <Skeleton className="bg-muted-foreground h-2 w-3/4"/>
                                <Skeleton className="bg-muted-foreground h-2 w-full"/>
                            </div>
                        ) : (
                            <>
                                <LabelNumber label="Current Price"
                                             formattedNumber={`$ ${marketPrice.toLocaleString()}`}/>
                                <div className={
                                    clsx(
                                        "text font-medium",
                                        isPositive(percentageChange) ? "text-green-400" : "text-destructive",
                                    )
                                }>
                                    <div>{getSignFromNumber(percentageChange)}{percentageChange}%</div>
                                </div>
                            </>
                        )
                    }
                </>

            </div>

            <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto ">

                <div className="flex flex-col w-full md:w-3/4 relative">
                    {
                        isLoading &&
                        <div
                            className={`absolute inset-0 flex h-[${chartHeight.toString()}px] items-center justify-center z-10 bg-muted`}>
                            <LoadingCircle size={40}/>
                        </div>
                    }
                    <div className="w-full" ref={chartContainerRef}/>
                    <div className="mt-4">
                        {
                            !isLoading &&
                            <Button variant="outline" onClick={scrollToRealTime}>
                                Go to real-time
                            </Button>
                        }
                    </div>

                </div>
                {
                    isLoading ? (
                            <div className="space-y-5 w-1/4 p-5 ">
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                                <Skeleton className="bg-muted-foreground h-4 w-full"/>
                                <Skeleton className="bg-muted-foreground h-4 w-3/4"/>
                            </div>
                        ) :
                        <div className="flex flex-col gap-20 w-full md:w-1/4 mt-8 md:mt-0 md:pl-8">
                            <div className="flex flex-col gap-5">
                                <LabelNumber label="Open" formattedNumber={`${details.open.toLocaleString()}`}/>
                                <LabelNumber label="High" formattedNumber={`${details.high.toLocaleString()}`}/>
                                <LabelNumber label="Low" formattedNumber={`${details.low.toLocaleString()}`}/>
                                <LabelNumber label="Close" formattedNumber={`${details.close.toLocaleString()}`}/>
                                <LabelNumber label="Volume" formattedNumber={`${details.volume.toLocaleString()}`}/>
                            </div>
                            <div>
                                <div className="grid gap-2">
                                    <Label htmlFor="amount">Quantity</Label>
                                    <Input id="amount" type="number" placeholder="5" required/>
                                </div>
                                <div className="flex flex-row gap-2 pt-2">
                                    <Button variant="outline" className="dark:border-green-500 flex-1 cursor-pointer">Buy</Button>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}