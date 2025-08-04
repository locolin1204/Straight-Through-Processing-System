package com.stp.straightthroughprocessing.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TickerSentiment {
    private String ticker;
    
    @JsonProperty("relevance_score")
    private String relevanceScore;

    @JsonProperty("ticker_sentiment_label")
    private String tickerSentimentLabel;

    @JsonProperty("ticker_sentiment_score")
    private String tickerSentimentScore;
}
