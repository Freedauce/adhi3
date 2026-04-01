package io.adhi.platform.repository;

import io.adhi.platform.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {
    Optional<Region> findByCode(String code);
}
