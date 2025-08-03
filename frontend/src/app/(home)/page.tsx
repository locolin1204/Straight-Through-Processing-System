import PersonalInfoCard from "@/components/home/personal-info-card";
import StocksCard from "@/components/home/stocks-card";
import NewsCard from "@/components/home/news-card";

export default function Home() {
    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-row w-full gap-10 mt-10">
                <PersonalInfoCard/>
                <NewsCard/>
            </div>
            <div className="w-full">
                <StocksCard/>
            </div>
        </div>
    );
}
