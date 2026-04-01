package io.adhi.platform.controller;

import io.adhi.platform.entity.Payment;
import io.adhi.platform.entity.User;
import io.adhi.platform.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<List<Payment>> findPending() {
        return ResponseEntity.ok(paymentService.findPending());
    }

    @PostMapping("/{orderId}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Payment> confirm(@PathVariable UUID orderId,
                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(paymentService.confirmPayment(orderId, user));
    }

    @PostMapping("/{orderId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ACCOUNTANT')")
    public ResponseEntity<Payment> reject(@PathVariable UUID orderId,
                                           @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(paymentService.rejectPayment(orderId, body.get("reason")));
    }
}
