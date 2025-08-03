package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.LiveStockData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface LiveStockDataRepository extends JpaRepository<LiveStockData, Long> {
    List<LiveStockData> findByTimestampBetween(OffsetDateTime start, OffsetDateTime end);
    List<LiveStockData> findByTickerAndTimestampBetween(String ticker, OffsetDateTime start, OffsetDateTime end);
}
