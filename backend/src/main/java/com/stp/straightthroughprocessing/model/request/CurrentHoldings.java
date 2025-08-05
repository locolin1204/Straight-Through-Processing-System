package com.stp.straightthroughprocessing.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CurrentHoldings {

    private Long userId;

    private String ticker;

    private Long quantity;

    private Double averagePrice;
}
