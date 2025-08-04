package com.stp.straightthroughprocessing.controller;

import com.stp.straightthroughprocessing.model.News;
import com.stp.straightthroughprocessing.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {
    @Autowired
    private NewsService newsService;

    @GetMapping("/all")
    public ResponseEntity<List<News>> getNews() {
        return new ResponseEntity<>(newsService.getAllNews(), HttpStatus.OK);
    }

    @GetMapping("/{date}")
    public ResponseEntity<List<News>> getNewsByDate(@PathVariable OffsetDateTime date) {
        List<News> newsList = newsService.getNewsByDate(date);
        return new ResponseEntity<>(newsList, HttpStatus.OK);
    }

    @GetMapping("{ticker}/{date}")
    public ResponseEntity<List<News>> getNewsByTickerAndDate(@PathVariable String ticker, @PathVariable OffsetDateTime date) {
        List<News> newsList = newsService.getNewsByTickerAndDate(ticker, date);
        return new ResponseEntity<>(newsList, HttpStatus.OK);
    }
}
