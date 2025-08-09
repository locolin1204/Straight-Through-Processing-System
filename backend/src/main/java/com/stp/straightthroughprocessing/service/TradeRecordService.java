package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.TradeRecord;
import com.stp.straightthroughprocessing.model.request.CurrentHoldings;
import com.stp.straightthroughprocessing.model.request.SellTradeRequest;
import com.stp.straightthroughprocessing.repository.TradeRecordRepository;
import com.stp.straightthroughprocessing.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class TradeRecordService {
    @Autowired
    private TradeRecordRepository tradeRecordRepo;

    @Autowired
    private UserService userService;

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

    public List<CurrentHoldings> getTradesByUserIdWithAverage(Long userId) {
        List<CurrentHoldings> holdings = tradeRecordRepo.findCurrentHoldingsByUserId(userId);
        if (holdings.isEmpty()) {
            throw new RuntimeException("No trades found for user ID: " + userId);
        }
        return holdings;
    }

//    public List<CurrentHoldings> getTradesByUserIdWithAverage(Long userId) {
//        List<Object[]> results = tradeRecordRepo.findGroupedTradesByUserId(userId);
//        if (results.isEmpty()) {
//            throw new RuntimeException("No trades found for user ID: " + userId);
//        }
//
//        return results.stream().map(result -> {
//            CurrentHoldings holding = new CurrentHoldings();
//            holding.setId((Long) result[0]);
//            holding.setUserId(userId);
//            holding.setTicker((String) result[1]);
//            holding.setQuantity((Long) result[2]);
//            holding.setAveragePrice((Double) result[3]);
//            return holding;
//        }).collect(Collectors.toList());
//    }

    public TradeRecord createTradeRecord(TradeRecord tradeRecord) {
//        tradeRecord.setTradeTimestamp(OffsetDateTime.now());
        tradeRecord.setHoldingId(tradeRecordRepo.findMaxHoldingIdByUserId(tradeRecord.getUserId()) + 1);
        userService.modifyCash(tradeRecord.getUserId(),-(tradeRecord.getPricePerShare()*tradeRecord.getQuantity()));
        return tradeRecordRepo.save(tradeRecord);
    }

    public List<TradeRecord> sellTrades(SellTradeRequest sellTradeRequest){
        List<TradeRecord> soldTrades = new ArrayList<>();
        tradeRecordRepo.findHoldingTradesWithMatchingBuyTrade(sellTradeRequest.getUserId()).forEach(
                holding -> {
                    if (holding.getTicker().equals(sellTradeRequest.getTicker())) {
                        TradeRecord sellTrade = new TradeRecord();
                        sellTrade.setUserId(sellTradeRequest.getUserId());
                        sellTrade.setTicker(holding.getTicker());
                        sellTrade.setQuantity(holding.getQuantity());
                        sellTrade.setTradeType("sell");
                        sellTrade.setPricePerShare(holding.getPricePerShare());
                        sellTrade.setPnl(sellTradeRequest.getMarketPrice() - holding.getPricePerShare());
                        sellTrade.setTradeTimestamp(OffsetDateTime.now());
                        sellTrade.setHoldingId(holding.getHoldingId());

                        soldTrades.add(tradeRecordRepo.save(sellTrade));
                        userService.modifyCash(sellTrade.getUserId(),
                                               (double) (sellTrade.getQuantity() * sellTradeRequest.getMarketPrice())
                        );
                    }
                }
        );
        return soldTrades;
    }

}


