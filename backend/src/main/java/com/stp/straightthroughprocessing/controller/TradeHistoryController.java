package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.TradeHistory;
import com.stp.straightthroughprocessing.service.TradeHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trade-histories")
public class TradeHistoryController {

    @Autowired
    private TradeHistoryService tradeHistoryService;

    // 全てのトレード履歴を取得するAPI
    @GetMapping("/all")
    public ResponseEntity<List<TradeHistory>> getAllTradeHistories() {
        List<TradeHistory> tradeHistories = tradeHistoryService.getAllTradeHistories();
        return new ResponseEntity<>(tradeHistories, HttpStatus.OK);
    }

    // 特定のユーザーIDに紐づくトレード履歴を取得するAPI
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TradeHistory>> getTradesByUserId(@PathVariable int userId) {
        List<TradeHistory> trades = tradeHistoryService.getTradesByUserId(userId);
        return new ResponseEntity<>(trades, HttpStatus.OK);
    }
}
