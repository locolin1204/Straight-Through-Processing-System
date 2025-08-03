package com.stp.straightthroughprocessing.service;

import com.stp.straightthroughprocessing.model.LiveStockData;
import com.stp.straightthroughprocessing.model.Ticker;
import com.stp.straightthroughprocessing.repository.LiveStockDataRepository;
import com.stp.straightthroughprocessing.repository.TickerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class TickerService {
    @Autowired
    private TickerRepository tickerRepo;

   public Ticker getTickerById(String ticker){
       return tickerRepo.findById(ticker).orElseThrow(() -> new RuntimeException("Ticker not found"));
   }

    public List<Ticker> getAllTickers() {
         return tickerRepo.findAll();
    }
}
