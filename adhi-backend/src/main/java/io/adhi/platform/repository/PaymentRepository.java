package io.adhi.platform.repository;

import io.adhi.platform.entity.Payment;
import io.adhi.platform.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByStatus(PaymentStatus status);
    Optional<Payment> findByOrder_Id(UUID orderId);
}
