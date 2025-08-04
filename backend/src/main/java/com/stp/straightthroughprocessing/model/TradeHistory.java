package com.stp.straightthroughprocessing.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class TradeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // 主キー（自動採番）

    @Column(name = "user_id" )
    private int userId;
    private String stockName;
    private String ticker;
    private int quantity;
    @Column(name = "trade_type")
    private String tradeType;
    private double gainLoss;
    @Column(name = "trade_date")
    private LocalDate tradeDate;

    // デフォルトコンストラクタ（JPA用）
    public TradeHistory() {
    }

    // 引数ありコンストラクタ
    public TradeHistory(String stockName, String ticker, int quantity, String tradeType, double gainLoss, LocalDate tradeDate) {
        this.stockName = stockName;
        this.ticker = ticker;
        this.quantity = quantity;
        this.tradeType = tradeType;
        this.gainLoss = gainLoss;
        this.tradeDate = tradeDate;
    }

    // --- ゲッターのみ記載（セッターは必要に応じて追加） ---
//    public Long getId() { return id; }
//    public String getStockName() { return stockName; }
//    public String getTicker() { return ticker; }
//    public int getQuantity() { return quantity; }
//    public String getTradeType() { return tradeType; }
//    public double getGainLoss() { return gainLoss; }
//    public LocalDate getTradeDate() { return tradeDate; }
}
