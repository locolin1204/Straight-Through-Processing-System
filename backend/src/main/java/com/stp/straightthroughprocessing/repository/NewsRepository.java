package com.stp.straightthroughprocessing.repository;

import com.stp.straightthroughprocessing.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
}
