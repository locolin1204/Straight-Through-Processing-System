package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.LiveStockData;
import com.stp.straightthroughprocessing.repository.LiveStockDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LiveStockDataService {
    @Autowired
    private LiveStockDataRepository liveStockDataRepo;

    public List<LiveStockData> getLiveStockDataByDate(){
        return liveStockDataRepo.findByTimestampBetween(
                OffsetDateTime.parse("2025-06-30T10:30:00+00:00"),
                OffsetDateTime.parse("2025-07-10T13:59:00+00:00")
        );
    }

    public List<LiveStockData> getLiveStockDataByTickerAndDate(String ticker, OffsetDateTime startDate){
        return liveStockDataRepo.findByTickerAndTimestampBetween(
                ticker,
                startDate,
                startDate.plusHours(5)
        );
    }

    public List<LiveStockData> getLiveStockDataByEndDate(int numberOfSamples, OffsetDateTime endDate, String ticker) {
        return liveStockDataRepo.findByTickerAndTimestampBetween(
                ticker,
                endDate.minusMinutes(numberOfSamples),
                endDate
        );
    }
}
