package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.HistoricalData;
import com.stp.straightthroughprocessing.repository.HistoricalDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HistoricalDataService {
    @Autowired
    private HistoricalDataRepository historicalDataRepo;

    public HistoricalData getHistoricalDataFromNearestPreviousDate(String ticker, LocalDate date) {
        return historicalDataRepo.findFirstByTickerAndDateLessThan(ticker, date.minusDays(1));
    }

    public List<HistoricalData> getAllHistoricalDataFromNearestPreviousDate(LocalDate date) {
        return historicalDataRepo.findAllByTickerAndDateLessThan(date.minusDays(1));
    }
}
