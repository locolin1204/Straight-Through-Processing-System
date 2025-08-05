package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.TradeRecord;
import com.stp.straightthroughprocessing.model.request.CurrentHoldings;
import com.stp.straightthroughprocessing.model.request.SellTradeRequest;
import com.stp.straightthroughprocessing.repository.TradeRecordRepository;
import com.stp.straightthroughprocessing.service.TradeRecordService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trade-record")
public class TradeRecordController {

    @Autowired
    private TradeRecordService tradeRecordService;

    @Autowired
    private TradeRecordRepository t;

    @GetMapping("/all")
    public ResponseEntity<List<TradeRecord>> getAllTradeHistories() {
        List<TradeRecord> tradeHistories = tradeRecordService.getAllTradeRecords();
        return new ResponseEntity<>(tradeHistories, HttpStatus.OK);
    }

    @GetMapping("/test")
    public ResponseEntity<Integer> getTest() {
        Integer tradeHistories = t.findMaxHoldingIdByUserId(2L);
        return new ResponseEntity<>(tradeHistories, HttpStatus.OK);
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<TradeRecord>> getTradesByUserId(@PathVariable Long userId) {
        List<TradeRecord> trades = tradeRecordService.getTradesByUserId(userId);
        return new ResponseEntity<>(trades, HttpStatus.OK);
    }

    @GetMapping("/holdings/{userId}")
    public ResponseEntity<List<CurrentHoldings>> getHoldingsTradesByUserId(@PathVariable Long userId) {
        List<CurrentHoldings> trades = tradeRecordService.getTradesByUserIdWithAverage(userId);
        return new ResponseEntity<>(trades, HttpStatus.OK);
    }

    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<TradeRecord> createTradeRecord(@RequestBody TradeRecord tradeRecord) {
        TradeRecord createdTradeRecord = tradeRecordService.createTradeRecord(tradeRecord);
        return new ResponseEntity<>(createdTradeRecord, HttpStatus.CREATED);
    }

    @PostMapping("/sell")
    @ResponseBody
    public ResponseEntity<List<TradeRecord>> sellTradeRecord(@RequestBody SellTradeRequest sellTradeRequest) {
        List<TradeRecord> soldTrades = tradeRecordService.sellTrades(sellTradeRequest);
        return new ResponseEntity<>(soldTrades, HttpStatus.CREATED);
    }
}
