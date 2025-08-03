package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.Ticker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TickerRepository extends JpaRepository<Ticker, String> {
}
