package io.adhi.platform.service;

import io.adhi.platform.entity.*;
import io.adhi.platform.enums.OrderStatus;
import io.adhi.platform.enums.PaymentStatus;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final OdooIntegrationService odooService;

    public List<Payment> findPending() {
        return paymentRepo.findByStatus(PaymentStatus.PENDING);
    }

    /**
     * Accountant confirms payment → Order moves to CONFIRMED → Triggers Odoo webhook.
     */
    @Transactional
    public Payment confirmPayment(UUID orderId, User confirmedBy) {
        Payment payment = paymentRepo.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Payment already processed: " + payment.getStatus());
        }

        payment.setStatus(PaymentStatus.CONFIRMED);
        payment.setConfirmedBy(confirmedBy);
        payment.setConfirmedAt(LocalDateTime.now());
        paymentRepo.save(payment);

        // Update order status
        Order order = payment.getOrder();
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentConfirmedAt(LocalDateTime.now());
        orderRepo.save(order);

        // Trigger Odoo procurement webhook
        odooService.sendProcurementOrder(order);

        return payment;
    }

    /**
     * Accountant rejects payment proof.
     */
    @Transactional
    public Payment rejectPayment(UUID orderId, String reason) {
        Payment payment = paymentRepo.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order: " + orderId));

        payment.setStatus(PaymentStatus.REJECTED);
        payment.setRejectionReason(reason);
        paymentRepo.save(payment);

        return payment;
    }
}
