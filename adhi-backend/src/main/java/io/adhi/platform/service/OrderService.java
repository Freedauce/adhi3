package io.adhi.platform.service;

import io.adhi.platform.dto.request.OrderRequest;
import io.adhi.platform.entity.*;
import io.adhi.platform.enums.BOQStatus;
import io.adhi.platform.enums.OrderStatus;
import io.adhi.platform.enums.PaymentStatus;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final BOQRepository boqRepo;
    private final PaymentRepository paymentRepo;

    @Transactional
    public Order createOrder(OrderRequest req, User user) {
        BOQ boq = boqRepo.findById(req.getBoqId())
                .orElseThrow(() -> new RuntimeException("BOQ not found: " + req.getBoqId()));

        if (boq.getStatus() != BOQStatus.APPROVED) {
            throw new RuntimeException("Can only create orders from APPROVED BOQs. Current: " + boq.getStatus());
        }

        Order order = Order.builder()
                .user(user)
                .boq(boq)
                .houseType(boq.getHouseType())
                .status(OrderStatus.PENDING_PAYMENT)
                .regionCode(boq.getRegionCode())
                .currency(boq.getCurrency())
                .totalAmountLocal(boq.getGrandTotalLocal())
                .totalAmountUsd(boq.getGrandTotalUsd())
                .odooSyncStatus("PENDING")
                .build();

        order = orderRepo.save(order);

        // Create a payment record
        Payment payment = Payment.builder()
                .order(order)
                .status(PaymentStatus.PENDING)
                .paymentMethod(req.getPaymentMethod())
                .build();
        paymentRepo.save(payment);

        return order;
    }

    public List<Order> findAll() {
        return orderRepo.findAll();
    }

    public List<Order> findByUser(UUID userId) {
        return orderRepo.findByUser_Id(userId);
    }

    public Order findById(UUID id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    @Transactional
    public Order updateStatus(UUID orderId, String newStatus) {
        Order order = findById(orderId);
        order.setStatus(OrderStatus.valueOf(newStatus));
        return orderRepo.save(order);
    }
}
