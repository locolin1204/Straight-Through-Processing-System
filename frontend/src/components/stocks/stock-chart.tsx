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
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LabelNumber from "@/components/label-number";
import { Input } from "@/components/ui/input";
import { useDateContext } from "@/contexts/date-context";

// Define a type for your data structure for clarity
interface StockData {
    timestamp: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export default function ChartComponent({selectedTicker}: {selectedTicker: string}) {
    // Refs for the chart and its series
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [details, setDetails] = useState({
        open: 0,
        high: 0,
        low: 0,
        close: 0,
    });

    const { date } = useDateContext();

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'black' },
                textColor: 'white',
            },
            height: 400,
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
        setDetails({ open: 0, high: 0, low: 0, close: 0 });

        // Function to fetch historical data
        const fetchHistoricalData = async () => {
            try {
                console.log(`Fetching historical data for ${selectedTicker}`);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/live-stock/historical/${selectedTicker}/${date?.toISOString()}`,
                    { signal: abortController.signal }
                );

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const historicalData: StockData[] = await response.json();

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
            console.log(`Connecting to live stream for ${selectedTicker}`);
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/live-stock/${selectedTicker}/${date?.toISOString()}`);
            eventSourceRef.current = eventSource;

            eventSource.onopen = () => console.log("EventSource connection opened.");

            eventSource.onmessage = (event) => {
                try {
                    const data: StockData = JSON.parse(event.data);
                    const candleData: CandlestickData = {
                        time: data.timestamp, open: data.open, high: data.high, low: data.low, close: data.close,
                    };
                    const volumeData: HistogramData = {
                        time: data.timestamp, value: data.volume, color: data.close >= data.open ? '#26a69a' : '#ef5350',
                    };

                    seriesRef.current?.update(candleData);
                    volumeSeriesRef.current?.update(volumeData);
                    setDetails(candleData);
                } catch (error) {
                    console.error("Error parsing live data:", error);
                }
            };

            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();
            };
        };

        // Chain the operations: fetch historical data, then connect to live stream
        fetchHistoricalData().then(() => {
            // Ensure the fetch was not aborted before connecting
            if (!abortController.signal.aborted) {
                connectToLiveStream();
            }
        });

        // The single, most important cleanup function
        return () => {
            console.log(`Cleaning up for ${selectedTicker}...`);
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
        <div className="p-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
            <div className="flex flex-col w-full md:w-3/4">
                <div className="w-full" ref={chartContainerRef} />
                <div className="mt-4">
                    <Button variant="outline" onClick={scrollToRealTime}>
                        Go to real-time
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-1/4 mt-8 md:mt-0 md:pl-8">
                <LabelNumber label="Open" formattedNumber={`$${details.open.toLocaleString()}`} />
                <LabelNumber label="High" formattedNumber={`$${details.high.toLocaleString()}`} />
                <LabelNumber label="Low" formattedNumber={`$${details.low.toLocaleString()}`} />
                <LabelNumber label="Close" formattedNumber={`$${details.close.toLocaleString()}`} />
                <div className="grid gap-2 pt-5">
                    <Label htmlFor="amount">Quantity</Label>
                    <Input id="amount" type="number" placeholder="100000" required />
                </div>
                <div className="flex flex-row gap-2 pt-2">
                    <Button variant="outline" className="border-green-500 flex-1">Buy</Button>
                    <Button variant="outline" className="border-red-500 flex-1">Sell</Button>
                </div>
            </div>
        </div>
    );
}