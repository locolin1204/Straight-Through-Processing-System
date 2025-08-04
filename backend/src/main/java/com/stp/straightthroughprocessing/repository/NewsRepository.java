package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findTop20ByTimePublishedBetweenOrderByTimePublishedDesc(OffsetDateTime start, OffsetDateTime end);

    @Query(value = "SELECT * FROM public.news n WHERE n.ticker_sentiment @> CAST(:tickerJson AS jsonb) AND n.time_published < :beforeTime ORDER BY n.time_published DESC LIMIT 20", nativeQuery = true)
    List<News> findTop20ByTickerAndBeforeTime(@Param("tickerJson") String tickerJson, @Param("beforeTime") OffsetDateTime beforeTime);
}
