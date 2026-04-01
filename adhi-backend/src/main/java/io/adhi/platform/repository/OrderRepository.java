package io.adhi.platform.repository;

import io.adhi.platform.entity.Order;
import io.adhi.platform.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUser_Id(UUID userId);
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByRegionCode(String regionCode);
}
