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
import java.util.List;

@RestController
@RequestMapping("/livestock")
public class LiveStockDataController {

    @Autowired
    private LiveStockDataService liveStockDataService;


    @GetMapping(value = "/stream/{ticker}/{offsetDateTime}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<LiveStockData> streamLiveStockByTicker(
            @PathVariable("ticker") String ticker, @PathVariable("offsetDateTime") OffsetDateTime offsetDateTime
    ) {
        List<LiveStockData> data = liveStockDataService.getLiveStockDataByTickerAndDate(ticker, offsetDateTime);

        return Flux.fromIterable(data)
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

//    @GetMapping(value = "/all/{offsetDateTime}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//    public Flux<LiveStockData> getAllLiveStock(@PathVariable("offsetDateTime") OffsetDateTime offsetDateTime) {
//        List<LiveStockData> data = liveStockDataService.getLiveStockDataByTickerAndDate(offsetDateTime);
//        return Flux.fromIterable(data)
//                .zipWith(Flux.interval(Duration.ofSeconds(1)))
//                .map(tuple -> tuple.getT1());
//    }


}
