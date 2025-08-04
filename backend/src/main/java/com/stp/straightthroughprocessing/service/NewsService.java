package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.News;
import com.stp.straightthroughprocessing.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepo;

    public List<News> getAllNews() {
        return newsRepo.findAll();
    }

    public List<News> getNewsByDate(OffsetDateTime date) {
        return newsRepo.findTop20ByTimePublishedBetweenOrderByTimePublishedDesc(
                date.minusHours(2),
                date
        );
    }

    public List<News> getNewsByTickerAndDate(String ticker, OffsetDateTime date) {
        String tickerJson = String.format("[{\"ticker\": \"%s\"}]", ticker);
        return newsRepo.findTop20ByTickerAndBeforeTime(tickerJson, date);
    }
}
