package com.stp.straightthroughprocessing.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "historical_stock_data")
@Data
public class HistoricalData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "ticker", nullable = false)
    private String ticker;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "open")
    private double open;

    @Column(name = "high")
    private double high;

    @Column(name = "low")
    private double low;

    @Column(name = "close")
    private double close;

    @Column(name = "adjusted_close")
    private double adjustedClose;

    @Column(name = "volume")
    private long volume;

    @Column(name = "dividend_amount")
    private Double dividendAmount;

    @Column(name = "split_coefficient")
    private Double splitCoefficient;

}
