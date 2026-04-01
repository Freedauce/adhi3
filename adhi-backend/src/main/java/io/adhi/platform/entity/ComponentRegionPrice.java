package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "component_region_prices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ComponentRegionPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    @Column(nullable = false)
    private String regionCode;

    @Column(precision = 14, scale = 2, nullable = false)
    private BigDecimal unitCost;

    private String odooSku;
}
