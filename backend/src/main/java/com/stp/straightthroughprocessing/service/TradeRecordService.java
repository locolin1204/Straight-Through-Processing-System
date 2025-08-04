package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.TradeRecord;
import com.stp.straightthroughprocessing.repository.TradeRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class TradeRecordService {
    @Autowired
    private TradeRecordRepository tradeRecordRepo;

    public List<TradeRecord> getAllTradeRecords() {
        return tradeRecordRepo.findAll();
    }

    public List<TradeRecord> getTradesByUserId(Long userId){
        List<TradeRecord> trades = tradeRecordRepo.findByUserId(userId);
        if (trades.isEmpty()) {
            throw new RuntimeException("No trades found for user ID: " + userId);
        }
        return trades;
    }

    public List<TradeRecord> getCurrentHoldingsByUserId(Long userId) {
        List<TradeRecord> trades = tradeRecordRepo.findHoldingTradesWithMatchingBuyTrade(userId);
        if (trades.isEmpty()) {
            throw new RuntimeException("No trades found for user ID: " + userId);
        }
        return trades;
    }

    public TradeRecord createTradeRecord(TradeRecord tradeRecord) {
//        tradeRecord.setTradeTimestamp(OffsetDateTime.now());
        tradeRecord.setHoldingId(tradeRecordRepo.findMaxHoldingIdByUserId(tradeRecord.getUserId()) + 1);
        return tradeRecordRepo.save(tradeRecord);
    }

}


