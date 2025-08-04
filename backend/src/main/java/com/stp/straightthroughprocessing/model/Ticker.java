package com.stp.straightthroughprocessing.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ticker")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ticker {
    @Id
    @Column(name = "ticker")
    private String ticker;

    private String name;
}
