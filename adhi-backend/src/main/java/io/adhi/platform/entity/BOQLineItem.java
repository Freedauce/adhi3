package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "boq_line_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BOQLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boq_id", nullable = false)
    private BOQ boq;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    private String rulesApplied; // comma-separated rule codes

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal qty;
    private String unit;

    @Column(precision = 14, scale = 2)
    private BigDecimal unitCost;

    @Column(precision = 14, scale = 2)
    private BigDecimal totalCost;

    private String odooSku;
    private String category;
    private int sortOrder;
}
