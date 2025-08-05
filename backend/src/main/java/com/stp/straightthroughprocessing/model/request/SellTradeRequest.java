package com.stp.straightthroughprocessing.model.request;

import lombok.Data;

@Data
public class SellTradeRequest {
    String ticker;
    Long marketPrice;
    Long userId;
}
