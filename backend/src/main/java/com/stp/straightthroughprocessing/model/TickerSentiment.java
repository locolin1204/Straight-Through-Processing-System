package com.stp.straightthroughprocessing.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TickerSentiment {
    private String ticker;
    private String relevance_score;
    private String ticker_sentiment_label;
    private String ticker_sentiment_score;
}
