package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "house_components")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HouseComponent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "house_type_id", nullable = false)
    private HouseType houseType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "component_id", nullable = false)
    private Component component;

    // Links this component to a rule that determines quantity
    private String defaultRuleId; // e.g., RULE-001

    // Fixed quantity override (for Fixed-type components)
    private Integer fixedQty;

    private int sortOrder;
}
