package io.adhi.platform.entity;

import io.adhi.platform.enums.BOQStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "boqs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BOQ {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BOQStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "house_type_id", nullable = false)
    private HouseType houseType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String regionCode;
    private String currency;
    private int configBedrooms;
    private int configBathrooms;
    private int configFloorAreaM2;
    private int unitCount;
    private String configRoofType;
    private String configFinishingGrade;

    @Column(precision = 14, scale = 2)
    private BigDecimal subtotalLocal;

    @Column(precision = 14, scale = 2)
    private BigDecimal taxAmount;

    @Column(precision = 14, scale = 2)
    private BigDecimal grandTotalLocal;

    @Column(precision = 14, scale = 2)
    private BigDecimal grandTotalUsd;

    private int taxRatePct;

    @OneToMany(mappedBy = "boq", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BOQLineItem> lineItems = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime lockedAt;
    private LocalDateTime approvedAt;
}
