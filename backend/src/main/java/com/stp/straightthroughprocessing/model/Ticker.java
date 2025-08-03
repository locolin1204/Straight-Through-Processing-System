package com.stp.straightthroughprocessing.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ticker")
@Data
public class Ticker {
    @Id
    @Column(name = "ticker")
    private String ticker;

    private String name;
}
