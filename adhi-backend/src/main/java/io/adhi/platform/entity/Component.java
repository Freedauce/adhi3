package io.adhi.platform.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "components")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Component {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String compCode; // COMP-001

    @Column(nullable = false)
    private String name;

    private String category; // Structural, Envelope, Interior, MEP, Finishes
    private String type;     // Fixed, Variable
    private String unit;     // set, panel, piece, unit, fixture, sheet, m2

    @Column(length = 500)
    private String description;
}
