package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "regions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 5)
    private String code; // RW, KE, TZ, UG

    @Column(nullable = false)
    private String label;

    private String currency;

    @Column(precision = 10, scale = 2)
    private BigDecimal fxRateToUsd;

    private int taxRatePct;
    private String taxLabel;
    private boolean active;
}
