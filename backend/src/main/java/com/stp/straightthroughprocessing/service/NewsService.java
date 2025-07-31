package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.News;
import com.stp.straightthroughprocessing.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepo;

    public List<News> getAllNews() {
        return newsRepo.findAll();
    }
}
