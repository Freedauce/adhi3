package io.adhi.platform.controller;

import io.adhi.platform.entity.ComponentRegionPrice;
import io.adhi.platform.entity.Order;
import io.adhi.platform.enums.OrderStatus;
import io.adhi.platform.repository.ComponentRegionPriceRepository;
import io.adhi.platform.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Inbound Odoo Webhooks — Receives data FROM Odoo TO ADHI.
 * Validates webhook secret header for security.
 */
@RestController
@RequestMapping("/webhooks/odoo")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    @Value("${adhi.odoo.webhook-secret}")
    private String webhookSecret;

    private final ComponentRegionPriceRepository priceRepo;
    private final OrderRepository orderRepo;

    /**
     * Odoo pushes updated unit costs for a component in a region.
     */
    @PostMapping("/price-update")
    public ResponseEntity<Map<String, String>> priceUpdate(
            @RequestHeader("X-Webhook-Secret") String secret,
            @RequestBody Map<String, Object> payload) {

        validateSecret(secret);

        String compCode = (String) payload.get("comp_code");
        String regionCode = (String) payload.get("region_code");
        BigDecimal newPrice = new BigDecimal(String.valueOf(payload.get("unit_cost")));

        ComponentRegionPrice pricing = priceRepo
                .findByComponent_CompCodeAndRegionCode(compCode, regionCode)
                .orElseThrow(() -> new RuntimeException("Pricing not found: " + compCode + "/" + regionCode));

        pricing.setUnitCost(newPrice);
        priceRepo.save(pricing);

        log.info("✅ Price update received from Odoo: {} in {} → {}", compCode, regionCode, newPrice);

        return ResponseEntity.ok(Map.of("status", "accepted", "comp_code", compCode));
    }

    /**
     * Odoo pushes stock availability changes.
     */
    @PostMapping("/stock-update")
    public ResponseEntity<Map<String, String>> stockUpdate(
            @RequestHeader("X-Webhook-Secret") String secret,
            @RequestBody Map<String, Object> payload) {

        validateSecret(secret);

        String sku = (String) payload.get("sku");
        int availableQty = (int) payload.get("available_qty");

        log.info("📦 Stock update from Odoo: SKU {} → {} available", sku, availableQty);
        // TODO: Store stock levels and flag BOQs that are affected

        return ResponseEntity.ok(Map.of("status", "accepted", "sku", sku));
    }

    /**
     * Odoo pushes delivery milestone updates.
     */
    @PostMapping("/delivery-update")
    public ResponseEntity<Map<String, String>> deliveryUpdate(
            @RequestHeader("X-Webhook-Secret") String secret,
            @RequestBody Map<String, Object> payload) {

        validateSecret(secret);

        String adhiOrderId = (String) payload.get("adhi_order_id");
        String status = (String) payload.get("delivery_status");

        Order order = orderRepo.findById(java.util.UUID.fromString(adhiOrderId))
                .orElseThrow(() -> new RuntimeException("Order not found: " + adhiOrderId));

        switch (status.toUpperCase()) {
            case "SHIPPED" -> order.setStatus(OrderStatus.SHIPPED);
            case "IN_TRANSIT" -> order.setStatus(OrderStatus.IN_TRANSIT);
            case "DELIVERED" -> order.setStatus(OrderStatus.DELIVERED);
        }

        orderRepo.save(order);
        log.info("🚚 Delivery update from Odoo: Order {} → {}", adhiOrderId, status);

        return ResponseEntity.ok(Map.of("status", "accepted", "order", adhiOrderId));
    }

    private void validateSecret(String secret) {
        if (!webhookSecret.equals(secret)) {
            throw new RuntimeException("Invalid webhook secret");
        }
    }
}
