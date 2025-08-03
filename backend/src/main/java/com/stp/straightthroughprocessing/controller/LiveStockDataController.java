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
@RequestMapping("/live-stock")
public class LiveStockDataController {

    @Autowired
    private LiveStockDataService liveStockDataService;

    // testing only
    @GetMapping(value = "", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<LiveStockData> streamLiveStock() {
        List<LiveStockData> data = liveStockDataService.getLiveStockDataByDate();

        return Flux.fromIterable(data)
                .zipWith(Flux.interval(Duration.ofSeconds(1)))
                .map(tuple -> tuple.getT1());
    }

    @GetMapping(value = "/{ticker}/{date}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<LiveStockData> streamLiveStockByTicker(
            @PathVariable("ticker") String ticker, @PathVariable("date") OffsetDateTime date
    ) {
        List<LiveStockData> data = liveStockDataService.getLiveStockDataByTickerAndDate(ticker, date);

        return Flux.fromIterable(data)
                .zipWith(Flux.interval(Duration.ofSeconds(1))) // Pair each item with interval tick
                .map(tuple -> tuple.getT1()); // Extract the LiveStockData from the tuple
    }

    @GetMapping("/historical/{ticker}/{date}")
    public ResponseEntity<List<LiveStockData>> getHistoricalData(@PathVariable("ticker") String ticker, @PathVariable("date") OffsetDateTime date) {
        List<LiveStockData> historicalData = liveStockDataService.getLiveStockDataByEndDate(60, date, ticker);
        return new ResponseEntity<>(historicalData, HttpStatus.OK);
    }


}
