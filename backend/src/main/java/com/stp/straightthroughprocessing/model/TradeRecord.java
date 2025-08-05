package com.stp.straightthroughprocessing.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;

@Entity
@Data
@Table(name = "trade_record")
public class TradeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id" )
    private Long userId;

    private String ticker;

    private Integer quantity;

    @Column(name = "trade_type")
    private String tradeType;

    @Column(name = "price_per_share")
    private Double pricePerShare;

    private Double pnl;

    @Column(name = "trade_timestamp")
    private OffsetDateTime tradeTimestamp;

    @Column(name = "holding_id")
    private Integer holdingId;
}
