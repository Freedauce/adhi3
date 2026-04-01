package io.adhi.platform.service;

import io.adhi.platform.dto.request.BOQRequest;
import io.adhi.platform.entity.*;
import io.adhi.platform.entity.Component;
import io.adhi.platform.enums.BOQStatus;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BOQService {

    private final HouseTypeRepository houseTypeRepo;
    private final HouseComponentRepository houseComponentRepo;
    private final ComponentRegionPriceRepository priceRepo;
    private final RegionRepository regionRepo;
    private final BOQRepository boqRepo;
    private final RulesEngineService rulesEngine;

    /**
     * Generate a BOQ preview (not saved to DB).
     */
    public BOQ preview(BOQRequest req) {
        return buildBOQ(req, BOQStatus.PREVIEW, null);
    }

    /**
     * Generate and save a BOQ (status: DRAFT).
     */
    @Transactional
    public BOQ generate(BOQRequest req, User user) {
        BOQ boq = buildBOQ(req, BOQStatus.DRAFT, user);
        return boqRepo.save(boq);
    }

    /**
     * Lock a BOQ (DRAFT → LOCKED). No more edits.
     */
    @Transactional
    public BOQ lock(UUID boqId) {
        BOQ boq = boqRepo.findById(boqId)
                .orElseThrow(() -> new RuntimeException("BOQ not found: " + boqId));

        if (boq.getStatus() != BOQStatus.DRAFT) {
            throw new RuntimeException("Can only lock a DRAFT BOQ. Current: " + boq.getStatus());
        }

        boq.setStatus(BOQStatus.LOCKED);
        boq.setLockedAt(LocalDateTime.now());
        return boqRepo.save(boq);
    }

    /**
     * Approve a BOQ (LOCKED → APPROVED). Triggers Odoo sync.
     */
    @Transactional
    public BOQ approve(UUID boqId) {
        BOQ boq = boqRepo.findById(boqId)
                .orElseThrow(() -> new RuntimeException("BOQ not found: " + boqId));

        if (boq.getStatus() != BOQStatus.LOCKED) {
            throw new RuntimeException("Can only approve a LOCKED BOQ. Current: " + boq.getStatus());
        }

        boq.setStatus(BOQStatus.APPROVED);
        boq.setApprovedAt(LocalDateTime.now());
        return boqRepo.save(boq);
    }

    public BOQ findById(UUID id) {
        return boqRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("BOQ not found: " + id));
    }

    public List<BOQ> findByUser(UUID userId) {
        return boqRepo.findByUser_Id(userId);
    }

    // ─── CORE BOQ BUILDER ─────────────────────────────────────────────

    private BOQ buildBOQ(BOQRequest req, BOQStatus status, User user) {
        HouseType house = houseTypeRepo.findByModelCode(req.getHouseTypeModelCode())
                .orElseThrow(() -> new RuntimeException("House type not found: " + req.getHouseTypeModelCode()));

        Region region = regionRepo.findByCode(req.getRegionCode())
                .orElseThrow(() -> new RuntimeException("Region not found: " + req.getRegionCode()));

        int bedrooms = req.getBedrooms() > 0 ? req.getBedrooms() : house.getDefaultBedrooms();
        int bathrooms = req.getBathrooms() > 0 ? req.getBathrooms() : house.getDefaultBathrooms();
        int floorAreaM2 = req.getFloorAreaM2() > 0 ? req.getFloorAreaM2() : house.getDefaultFloorAreaM2();

        // Get all components linked to this house type
        List<HouseComponent> houseComponents = houseComponentRepo
                .findByHouseType_IdOrderBySortOrderAsc(house.getId());

        BigDecimal finishingMultiplier = rulesEngine.getFinishingMultiplier(req.getFinishingGrade());

        BOQ boq = BOQ.builder()
                .status(status)
                .houseType(house)
                .user(user)
                .regionCode(region.getCode())
                .currency(region.getCurrency())
                .configBedrooms(bedrooms)
                .configBathrooms(bathrooms)
                .configFloorAreaM2(floorAreaM2)
                .configRoofType(req.getRoofType())
                .configFinishingGrade(req.getFinishingGrade())
                .taxRatePct(region.getTaxRatePct())
                .lineItems(new ArrayList<>())
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;

        for (int i = 0; i < houseComponents.size(); i++) {
            HouseComponent hc = houseComponents.get(i);
            Component comp = hc.getComponent();

            // Calculate quantity via Rules Engine
            int qty = rulesEngine.calculateQuantity(hc, bedrooms, bathrooms, floorAreaM2,
                    req.getRoofType(), req.getFinishingGrade());

            // Lookup regional pricing
            ComponentRegionPrice pricing = priceRepo
                    .findByComponent_CompCodeAndRegionCode(comp.getCompCode(), region.getCode())
                    .orElse(null);

            BigDecimal unitCost = pricing != null ? pricing.getUnitCost() : BigDecimal.ZERO;

            // Apply finishing multiplier for finish-related components
            if ("Finishes".equals(comp.getCategory())) {
                unitCost = unitCost.multiply(finishingMultiplier).setScale(2, RoundingMode.HALF_UP);
            }

            BigDecimal totalCost = unitCost.multiply(BigDecimal.valueOf(qty));

            BOQLineItem lineItem = BOQLineItem.builder()
                    .boq(boq)
                    .component(comp)
                    .qty(qty)
                    .unit(comp.getUnit())
                    .unitCost(unitCost)
                    .totalCost(totalCost)
                    .odooSku(pricing != null ? pricing.getOdooSku() : null)
                    .category(comp.getCategory())
                    .sortOrder(i)
                    .rulesApplied(hc.getDefaultRuleId())
                    .build();

            boq.getLineItems().add(lineItem);
            subtotal = subtotal.add(totalCost);
        }

        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(region.getTaxRatePct()))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal grandTotal = subtotal.add(taxAmount);
        BigDecimal grandTotalUsd = grandTotal.divide(region.getFxRateToUsd(), 2, RoundingMode.HALF_UP);

        boq.setSubtotalLocal(subtotal);
        boq.setTaxAmount(taxAmount);
        boq.setGrandTotalLocal(grandTotal);
        boq.setGrandTotalUsd(grandTotalUsd);

        return boq;
    }
}
