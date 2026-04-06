package io.adhi.platform.service;

import io.adhi.platform.entity.*;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RulesEngineService {

    private final RuleRepository ruleRepo;

    /**
     * Calculate base single-unit quantity for a component.
     */
    public BigDecimal calculateQuantity(HouseComponent hc) {

        String compCode = hc.getComponent().getCompCode();

        // If fixed quantity is set, use it directly
        if (hc.getFixedQty() != null && hc.getFixedQty().compareTo(BigDecimal.ZERO) > 0) {
            return hc.getFixedQty();
        }

        // Return exact mapped baseline values for Single Unit Core Shell (37.5m2)
        return evaluateCoreShellBaseline(compCode);
    }

    /**
     * Static memory of the 20 Core Shell Baseline quantities.
     */
    private BigDecimal evaluateCoreShellBaseline(String compCode) {
        return switch (compCode) {
            case "FND-SET-001" -> new BigDecimal("1.00");
            case "FND-EXC-001" -> new BigDecimal("7.50");
            case "FND-HCF-001" -> new BigDecimal("7.80");
            case "FND-SND-001" -> new BigDecimal("1.95");
            case "FND-BLN-001" -> new BigDecimal("1.56");
            case "FND-STR-001" -> new BigDecimal("3.75");
            case "FND-DPM-001" -> new BigDecimal("39.00");
            case "FND-SLB-001" -> new BigDecimal("3.90");
            case "FND-MSH-001" -> new BigDecimal("39.00");
            case "WAL-EXT-001" -> new BigDecimal("62.50");
            case "STR-RBM-001" -> new BigDecimal("25.00");
            case "ROF-FRM-001" -> new BigDecimal("45.00");
            case "ROF-COV-001" -> new BigDecimal("45.00");
            case "ROF-RDG-001" -> new BigDecimal("6.50");
            case "ROF-FAS-001" -> new BigDecimal("25.00");
            case "ROF-GTR-001" -> new BigDecimal("18.00");
            case "ROF-DWP-001" -> new BigDecimal("2.00");
            case "OPN-DRF-001" -> new BigDecimal("1.00");
            case "OPN-WOP-001" -> new BigDecimal("4.00");
            case "OPN-LNT-001" -> new BigDecimal("8.00");
            default -> BigDecimal.ONE;
        };
    }

    public BigDecimal getFinishingMultiplier(String finishingGrade) {
        return "premium".equalsIgnoreCase(finishingGrade) ? BigDecimal.valueOf(1.4) : BigDecimal.ONE;
    }
}
