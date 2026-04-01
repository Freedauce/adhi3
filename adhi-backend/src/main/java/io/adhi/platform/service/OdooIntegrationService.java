package io.adhi.platform.service;

import io.adhi.platform.entity.*;
import io.adhi.platform.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

/**
 * Outbound Odoo Integration — Sends data FROM ADHI TO Odoo.
 * Per v1.1 spec: ADHI owns qty + sku (locked). Odoo owns pricing, routing, landed costs.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OdooIntegrationService {

    @Value("${adhi.odoo.base-url}")
    private String odooBaseUrl;

    @Value("${adhi.odoo.api-key}")
    private String odooApiKey;

    @Value("${adhi.odoo.database}")
    private String odooDatabase;

    @Value("${adhi.odoo.endpoints.purchase-order}")
    private String purchaseOrderEndpoint;

    private final OrderRepository orderRepo;

    /**
     * Send procurement order to Odoo when payment is confirmed.
     * POST /api/v1/purchase.order
     */
    public void sendProcurementOrder(Order order) {
        try {
            BOQ boq = order.getBoq();
            List<Map<String, Object>> lines = new ArrayList<>();

            for (BOQLineItem item : boq.getLineItems()) {
                Map<String, Object> line = new HashMap<>();
                line.put("product_sku", item.getOdooSku());
                line.put("product_name", item.getComponent().getName());
                line.put("quantity", item.getQty());
                line.put("unit", item.getUnit());
                line.put("unit_price", item.getUnitCost());
                line.put("subtotal", item.getTotalCost());
                lines.add(line);
            }

            Map<String, Object> payload = new HashMap<>();
            payload.put("adhi_order_id", order.getId().toString());
            payload.put("database", odooDatabase);
            payload.put("region_code", order.getRegionCode());
            payload.put("currency", order.getCurrency());
            payload.put("total_amount", order.getTotalAmountLocal());
            payload.put("order_lines", lines);
            payload.put("created_at", order.getCreatedAt().toString());

            WebClient client = WebClient.builder()
                    .baseUrl(odooBaseUrl)
                    .defaultHeader("Authorization", "Bearer " + odooApiKey)
                    .defaultHeader("Content-Type", "application/json")
                    .build();

            client.post()
                    .uri(purchaseOrderEndpoint)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .subscribe(
                        response -> {
                            order.setOdooSyncStatus("SUCCESS");
                            order.setOdooProcurementId(String.valueOf(response.get("procurement_id")));
                            orderRepo.save(order);
                            log.info("✅ Odoo procurement order created for: {}", order.getId());
                        },
                        error -> {
                            order.setOdooSyncStatus("FAILED");
                            orderRepo.save(order);
                            log.error("❌ Odoo sync failed for order: {}", order.getId(), error);
                        }
                    );

        } catch (Exception e) {
            order.setOdooSyncStatus("FAILED");
            orderRepo.save(order);
            log.error("❌ Exception sending to Odoo: {}", e.getMessage(), e);
        }
    }
}
