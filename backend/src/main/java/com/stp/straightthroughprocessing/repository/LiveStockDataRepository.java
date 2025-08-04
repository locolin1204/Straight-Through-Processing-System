package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.HistoricalData;
import com.stp.straightthroughprocessing.model.LiveStockData;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface LiveStockDataRepository extends JpaRepository<LiveStockData, Long> {
    List<LiveStockData> findByTimestampBetween(OffsetDateTime start, OffsetDateTime end);
    List<LiveStockData> findByTickerAndTimestampBetween(String ticker, OffsetDateTime start, OffsetDateTime end);

    @QueryHints({@QueryHint(name = "org.hibernate.cacheable", value = "false")})
    List<LiveStockData> findByTimestampBetweenOrderByTimestampAsc(OffsetDateTime start, OffsetDateTime end);

    @Query("SELECT h FROM LiveStockData h WHERE h.ticker = :ticker AND h.timestamp < :timestamp ORDER BY h.timestamp DESC LIMIT 1")
    LiveStockData findFirstByTickerAndDateLessThan(String ticker, OffsetDateTime timestamp);

    @Query(value = "SELECT l.* FROM LiveStockData l " +
            "JOIN (SELECT ticker, MAX(timestamp) AS max_timestamp " +
            "      FROM LiveStockData WHERE timestamp < :offsetDateTime " +
            "      GROUP BY ticker) AS prev " +
            "ON l.ticker = prev.ticker AND l.timestamp = prev.max_timestamp",
            nativeQuery = true)
    List<LiveStockData> findPreviousLiveStockDataByOffset(@Param("offsetDateTime") OffsetDateTime offsetDateTime);
}
