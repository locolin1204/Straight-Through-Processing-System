import React from 'react';
import PortfolioCard from "@/components/portfolio/portfolio-card";
import CurrentHoldingsCard from "@/components/portfolio/current-holdings-card";
import TradeHistoryCard from "@/components/portfolio/trade-history-card";

export default function PortfolioPage() {
    return (
        <div className="flex flex-col gap-5 my-10">
            <PortfolioCard />
            <CurrentHoldingsCard />
            <TradeHistoryCard />
        </div>
    );
}