package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.HistoricalData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface HistoricalDataRepository extends JpaRepository<HistoricalData, Long> {
    HistoricalData findByTickerAndDate(String ticker, OffsetDateTime date);

    @Query("SELECT h FROM HistoricalData h WHERE h.ticker = :ticker AND h.date < :date ORDER BY h.date DESC LIMIT 1")
    HistoricalData findFirstByTickerAndDateLessThan(String ticker, LocalDate date);

    @Query("SELECT h FROM HistoricalData h WHERE h.date = (SELECT MAX(h2.date) FROM HistoricalData h2 WHERE h2.ticker = h.ticker AND h2.date < :date)")
    List<HistoricalData> findAllByTickerAndDateLessThan(LocalDate date);
}