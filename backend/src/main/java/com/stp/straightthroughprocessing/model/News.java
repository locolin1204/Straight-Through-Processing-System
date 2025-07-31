package com.stp.straightthroughprocessing.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "news")
@Data
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Use IDENTITY for auto-incrementing PK in Postgres
    private Long id;

    private String title;

    @Column(name = "time_published")
    private OffsetDateTime timePublished;

    @JdbcTypeCode(SqlTypes.JSON)
    @Type(value = JsonType.class) // Use JsonType to map JSONB to List<Topic>
    @Column(name = "topics") // Explicitly map to the 'topics' column
    private List<Topic> topics;

    @JdbcTypeCode(SqlTypes.JSON)
    @Type(value = JsonType.class) // Use JsonType to map JSONB to List<TickerSentiment>
    @Column(name = "ticker_sentiment") // Explicitly map to the 'ticker_sentiment' column
    private List<TickerSentiment> tickerSentimentList;
}