package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.Ticker;
import com.stp.straightthroughprocessing.service.TickerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ticker")
public class TickerController {
    @Autowired
    private TickerService tickerService;

    @GetMapping("/{ticker}")
    public ResponseEntity<Ticker> getTickerById(@PathVariable  String ticker) {
        Ticker tickerData = tickerService.getTickerById(ticker);
        return new ResponseEntity<>(tickerData, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Ticker>> getAllTickers() {
        List<Ticker> tickers = tickerService.getAllTickers();
        return new ResponseEntity<>(tickers, HttpStatus.OK);
    }
}