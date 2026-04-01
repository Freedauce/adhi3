package io.adhi.platform.repository;

import io.adhi.platform.entity.BOQ;
import io.adhi.platform.enums.BOQStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BOQRepository extends JpaRepository<BOQ, UUID> {
    List<BOQ> findByUser_Id(UUID userId);
    List<BOQ> findByStatus(BOQStatus status);
}
