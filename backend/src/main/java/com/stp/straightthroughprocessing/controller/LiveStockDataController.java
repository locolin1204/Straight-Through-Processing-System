package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.LiveStockData;
import com.stp.straightthroughprocessing.service.LiveStockDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/livestock")
public class LiveStockDataController {

    @Autowired
    private LiveStockDataService liveStockDataService;


    @GetMapping(value = "/stream/{ticker}/{offsetDateTime}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<LiveStockData> streamLiveStockByTicker(
            @PathVariable("ticker") String ticker, @PathVariable("offsetDateTime") OffsetDateTime offsetDateTime
    ) {
        List<LiveStockData> data = liveStockDataService.getLiveStockDataByTickerAndDateStream(ticker, offsetDateTime);

        return Flux.fromIterable(data)
                .zipWith(Flux.interval(Duration.ofSeconds(1)))
                .map(tuple -> tuple.getT1());
    }

    @GetMapping(value = "stream/all/{offsetDateTime}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<List<LiveStockData>> streamAllLiveStock(@PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
//        List<LiveStockData> data = liveStockDataService.getLiveStockDataByTickerAndDateStream(offsetDateTime);
//        return Flux.fromIterable(data)
//                .zipWith(Flux.interval(Duration.ofSeconds(1)))
//                .map(tuple -> tuple.getT1());
        List<LiveStockData> data = liveStockDataService.getAllLiveStockDataByDateStream(offsetDateTime);

        Map<OffsetDateTime, List<LiveStockData>> groupedMap = data.stream()
                .collect(Collectors.groupingBy(LiveStockData::getTimestamp, TreeMap::new, Collectors.toList()));

        List<List<LiveStockData>> groupedData = new ArrayList<>(groupedMap.values());

        return Flux.fromIterable(groupedData)
                .zipWith(Flux.interval(Duration.ofSeconds(1)))
                .map(tuple -> tuple.getT1());
    }

    @GetMapping("/historical/{ticker}/{offsetDateTime}")
    public ResponseEntity<List<LiveStockData>> getHistoricalData(@PathVariable("ticker") String ticker, @PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
        List<LiveStockData> historicalData = liveStockDataService.getLiveStockDataByEndDate(ticker, offsetDateTime, 60);
        return new ResponseEntity<>(historicalData, HttpStatus.OK);
    }

    @GetMapping(value = "/all/{offsetDateTime}")
    public ResponseEntity<List<LiveStockData>> getAllLiveStock(@PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
        return new ResponseEntity<>(liveStockDataService.getAllLiveStockDataByDate(offsetDateTime), HttpStatus.OK);
    }

    @GetMapping("/closest-previous/all/{offsetDateTime}")
    public ResponseEntity<List<LiveStockData>> getAllHistoricalData(@PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
        List<LiveStockData> liveDataList = liveStockDataService.getAllLiveDataFromNearestPreviousDate(offsetDateTime);
        return new ResponseEntity<>(liveDataList, HttpStatus.OK);
    }

    @GetMapping("/closest-previous/{ticker}/{offsetDateTime}")
    public ResponseEntity<LiveStockData> getAllHistoricalData(@PathVariable("ticker") String ticker,  @PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
        LiveStockData liveData = liveStockDataService.getLiveDataByTickerFromNearestPreviousDate(ticker, offsetDateTime);
        return new ResponseEntity<>(liveData, HttpStatus.OK);
    }

}
