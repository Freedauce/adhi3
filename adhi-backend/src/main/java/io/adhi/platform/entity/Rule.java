package io.adhi.platform.entity;

import io.adhi.platform.enums.RuleLayer;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "rules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Rule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String ruleCode; // RULE-001

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RuleLayer layer; // BASE, ADJUSTMENT, GUARD, OVERRIDE

    @Column(nullable = false)
    private String trigger; // house_type, floor_area_m2, roof_type, etc.

    @Column(length = 500)
    private String formula; // Human-readable description

    private String outputCompCode; // COMP-002, ALL, etc.

    private String status; // PUBLISHED, DRAFT

    private int version;
}
