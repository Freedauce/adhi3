package io.adhi.platform.entity;

import io.adhi.platform.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boq_id", nullable = false)
    private BOQ boq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "house_type_id", nullable = false)
    private HouseType houseType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    private String regionCode;
    private String currency;

    @Column(precision = 14, scale = 2)
    private BigDecimal totalAmountLocal;

    @Column(precision = 14, scale = 2)
    private BigDecimal totalAmountUsd;

    private String odooSyncStatus; // PENDING, SUCCESS, FAILED
    private String odooProcurementId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime paymentConfirmedAt;
}
