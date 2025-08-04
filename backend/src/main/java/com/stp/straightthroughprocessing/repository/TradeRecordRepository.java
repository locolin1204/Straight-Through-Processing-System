package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.TradeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface TradeRecordRepository extends JpaRepository<TradeRecord, Long> {
    List<TradeRecord> findByUserId(Long userId);

    @Query("SELECT t1 FROM TradeRecord t1 WHERE t1.tradeType = 'sell' AND t1.userId = 2 AND EXISTS (SELECT 1 FROM TradeRecord t2 WHERE t2.tradeType = 'buy' AND t2.holdingId = t1.holdingId) ORDER by t1.tradeTimestamp DESC")
    List<TradeRecord> findSellTradesWithMatchingBuyTrade(@PathVariable Long userId);

    @Query("SELECT t1 FROM TradeRecord t1 WHERE t1.tradeType = 'buy' AND t1.userId = 2 AND NOT EXISTS (SELECT 1 FROM TradeRecord t2 WHERE t2.tradeType = 'sell' AND t2.holdingId = t1.holdingId) ORDER by t1.tradeTimestamp DESC")
    List<TradeRecord> findHoldingTradesWithMatchingBuyTrade(@PathVariable Long userId);

    @Query("SELECT MAX(t.holdingId) FROM TradeRecord t WHERE t.userId = :userId")
    Integer findMaxHoldingIdByUserId(@Param("userId") Long userId);
}
