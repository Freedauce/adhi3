package io.adhi.platform.service;

import io.adhi.platform.entity.*;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

/**
 * Rules Engine — SERVER-SIDE Implementation
 * Implements the BASE / ADJUSTMENT / GUARD pattern (v1.1 Fix 2).
 *
 * For each component linked to a house type:
 *   1. Run BASE rule → baseQty
 *   2. Run ADJUSTMENT rule → adjQty
 *   3. Run GUARD (max/min) → finalQty = max(baseQty, adjQty)
 */
@Service
@RequiredArgsConstructor
public class RulesEngineService {

    private final RuleRepository ruleRepo;

    /**
     * Calculate quantity for a single component given the house configuration.
     */
    public int calculateQuantity(HouseComponent hc, int bedrooms, int bathrooms, int floorAreaM2,
                                  String roofType, String finishingGrade) {

        String compCode = hc.getComponent().getCompCode();

        // If fixed quantity is set, use it directly
        if (hc.getFixedQty() != null && hc.getFixedQty() > 0) {
            return hc.getFixedQty();
        }

        // Fetch all rules targeting this component
        List<Rule> rules = ruleRepo.findByOutputCompCode(compCode);

        int baseQty = 0;
        int adjQty = 0;
        boolean hasBase = false;
        boolean hasAdj = false;

        for (Rule rule : rules) {
            if (!"PUBLISHED".equals(rule.getStatus())) continue;

            int computed = evaluateRule(rule, bedrooms, bathrooms, floorAreaM2, roofType, finishingGrade);

            switch (rule.getLayer()) {
                case BASE -> {
                    baseQty = computed;
                    hasBase = true;
                }
                case ADJUSTMENT -> {
                    adjQty = computed;
                    hasAdj = true;
                }
                case GUARD -> {
                    // Guard: take max of base and adjustment
                    return Math.max(baseQty, adjQty);
                }
                default -> {}
            }
        }

        // If we have both base and adjustment but no GUARD, apply max automatically
        if (hasBase && hasAdj) return Math.max(baseQty, adjQty);
        if (hasBase) return baseQty;
        if (hasAdj) return adjQty;

        // Fallback — use fixed qty if set, else 1
        return hc.getFixedQty() != null ? hc.getFixedQty() : 1;
    }

    /**
     * Evaluate a single rule against the configuration parameters.
     * This engine interprets rules based on their trigger field.
     */
    private int evaluateRule(Rule rule, int bedrooms, int bathrooms, int floorAreaM2,
                              String roofType, String finishingGrade) {

        return switch (rule.getTrigger()) {
            case "house_type" -> {
                // Wall panels by house type: 0BR→10, 1BR→16, 2BR→24, 3BR→32, 4BR→40
                yield switch (bedrooms) {
                    case 0 -> 10;
                    case 1 -> 16;
                    case 2 -> 24;
                    case 3 -> 32;
                    case 4 -> 40;
                    default -> 16 + (bedrooms * 8);
                };
            }
            case "floor_area_m2" -> {
                // Wall panels by perimeter: ceil(perimeter / 0.6)
                double side = Math.sqrt(floorAreaM2);
                double perimeter = side * 4;
                yield (int) Math.ceil(perimeter / 0.6);
            }
            case "roof_type" -> {
                yield switch (roofType.toLowerCase()) {
                    case "flat" -> 6;
                    case "pitched" -> 10;
                    case "hip" -> 14;
                    default -> 6;
                };
            }
            case "bedrooms" -> {
                String comp = rule.getOutputCompCode();
                yield switch (comp) {
                    case "COMP-004" -> Math.max(bedrooms, 1);     // Internal Partitions
                    case "COMP-005" -> bedrooms + 2;               // Doors
                    case "COMP-006" -> (bedrooms * 2) + 2;         // Windows
                    default -> bedrooms;
                };
            }
            case "bathrooms" -> {
                // Plumbing fixtures = bathrooms × 3
                yield bathrooms * 3;
            }
            case "finishing_grade" -> {
                // Not a quantity rule — this is a cost multiplier (handled in BOQService)
                yield 1;
            }
            default -> 1;
        };
    }

    /**
     * Get the finishing grade cost multiplier.
     */
    public BigDecimal getFinishingMultiplier(String finishingGrade) {
        return "premium".equalsIgnoreCase(finishingGrade) ? BigDecimal.valueOf(1.4) : BigDecimal.ONE;
    }
}
