import { Button } from "@/components/ui/button";
import PersonalInfoCard from "@/components/home/personal-info-card";
import StocksCard from "@/components/home/stocks-card";
import NewsCard from "@/components/home/news-card";

export default function Home() {
    return (
        <>
            <div className="flex flex-row w-full">
                <PersonalInfoCard/>
                <NewsCard/>
            </div>
            <div className="w-full">
            <StocksCard/>
            </div>
        </>
    );
}
