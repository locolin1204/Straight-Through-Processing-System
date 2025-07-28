package com.stp.straightthroughprocessing.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.OffsetDateTime;

@Entity
@Table(name = "live_stock_data")
@Data
public class LiveStockData {
    @Id
    @Column(name = "timestamp", columnDefinition = "timestamptz")
    private OffsetDateTime timestamp;

    @Column(name = "open")
    private double open;

    @Column(name = "high")
    private double high;

    @Column(name = "low")
    private double low;

    @Column(name = "close")
    private double close;

    @Column(name = "volume")
    private long volume;

    @Column(name = "ticker")
    private String ticker;
}
