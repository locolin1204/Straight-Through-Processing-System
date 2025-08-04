package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.LiveStockData;
import com.stp.straightthroughprocessing.model.Ticker;
import com.stp.straightthroughprocessing.repository.LiveStockDataRepository;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class LiveStockDataService {
    @Autowired
    private LiveStockDataRepository liveStockDataRepo;

    @Autowired
    private TickerService tickerService;

    @Autowired
    private EntityManager entityManager;

    public List<LiveStockData> getLiveStockDataByTickerAndDate(String ticker, OffsetDateTime startDate) {
        return liveStockDataRepo.findByTickerAndTimestampBetween(
                ticker,
                startDate,
                startDate.plusHours(5)
        );
    }

    public List<LiveStockData> getAllLiveStockDataByDate(OffsetDateTime startDate) {
        System.out.println("Fetching all live stock data for date: " + startDate);
        List<LiveStockData> allLiveStock = new ArrayList<>();
        List<Ticker> tickers = tickerService.getAllTickers();
        tickers.forEach(ticker -> {
            System.out.println(ticker);
            LiveStockData data = liveStockDataRepo.findFirstByTickerAndDateLessThan(ticker.getTicker(), startDate);
            System.out.println(data);
            allLiveStock.add(data);
            entityManager.clear();
        });

        return allLiveStock;
    }

    public LiveStockData getLiveDataByTickerFromNearestPreviousDate(String ticker, OffsetDateTime offsetDateTime) {
        System.out.println("offsetDateTime.truncatedTo(ChronoUnit.DAYS)" + offsetDateTime.truncatedTo(ChronoUnit.DAYS));
        return liveStockDataRepo.findFirstByTickerAndDateLessThan(ticker, offsetDateTime);
    }

    public List<LiveStockData> getAllLiveDataFromNearestPreviousDate(OffsetDateTime offsetDateTime) {
        System.out.println("offsetDateTime.truncatedTo(ChronoUnit.DAYS)" + offsetDateTime.truncatedTo(ChronoUnit.DAYS));
        return this.getAllLiveStockDataByDate(offsetDateTime.truncatedTo(ChronoUnit.DAYS));
    }


    public List<LiveStockData> getLiveStockDataByEndDate(String ticker, OffsetDateTime endDate, int numberOfSamples) {
        return liveStockDataRepo.findByTickerAndTimestampBetween(
                ticker,
                endDate.minusMinutes(numberOfSamples),
                endDate
        );
    }
}
