package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.TradeHistory;
import com.stp.straightthroughprocessing.model.User;
import com.stp.straightthroughprocessing.repository.TradeHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeHistoryService {
    @Autowired
    private TradeHistoryRepository tradeHistoryRepo;

    public List<TradeHistory> getAllTradeHistories() {
        return tradeHistoryRepo.findAll();
    }

    public List<TradeHistory> getTradesByUserId(int userId){
        List<TradeHistory> trades = tradeHistoryRepo.findByUserId(userId);
        if (trades.isEmpty()) {
            throw new RuntimeException("No trades found for user ID: " + userId);
        }
        return trades;
    }
}

//@Service
//public class TradeHistoryService {
//    @Autowired
//    private TradeHistoryRepository tradeHistoryRepo;
//
//    public List<TradeHistory> getAllTradeHistories() {
//        return tradeHistoryRepo.findAll();
//    }
//
//    public TradeHistory getTradeByUserId(Long userId){
//        return tradeHistoryRepo.findById(userId).orElseThrow(() -> new RuntimeException("Trade not found"));
//    }
//
//}

