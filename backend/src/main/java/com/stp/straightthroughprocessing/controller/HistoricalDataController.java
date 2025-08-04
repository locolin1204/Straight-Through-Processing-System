package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.HistoricalData;
import com.stp.straightthroughprocessing.service.HistoricalDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/historical-data")
public class HistoricalDataController {
    @Autowired
    private HistoricalDataService historicalDataService;

    @GetMapping("/closest-previous/{ticker}/{date}")
    public ResponseEntity<HistoricalData> getHistoricalDataByTicker(@PathVariable("ticker") String ticker, @PathVariable("date") LocalDate date) {
        HistoricalData historicalData = historicalDataService.getHistoricalDataFromNearestPreviousDate(ticker, date);
        return new ResponseEntity<>(historicalData, HttpStatus.OK);
    }

    @GetMapping("/closest-previous/all/{date}")
    public ResponseEntity<List<HistoricalData>> getAllHistoricalData(@PathVariable("date") LocalDate date) {
        List<HistoricalData> historicalDataList = historicalDataService.getAllHistoricalDataFromNearestPreviousDate(date);
        return new ResponseEntity<>(historicalDataList, HttpStatus.OK);
    }
}
