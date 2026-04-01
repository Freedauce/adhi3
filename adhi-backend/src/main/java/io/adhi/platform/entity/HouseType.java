package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "house_types")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HouseType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String modelCode;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private int defaultBedrooms;
    private int defaultBathrooms;
    private int defaultFloorAreaM2;
    private int assemblyWeeks;

    @Column(precision = 12, scale = 2)
    private BigDecimal basePriceUsd;

    private String imageUrl;
    private String tag;

    @Column(nullable = false)
    private String status; // ACTIVE, DRAFT, ARCHIVED

    @OneToMany(mappedBy = "houseType", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<HouseComponent> houseComponents = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
