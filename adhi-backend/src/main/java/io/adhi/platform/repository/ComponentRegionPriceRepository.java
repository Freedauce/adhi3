package io.adhi.platform.repository;

import io.adhi.platform.entity.ComponentRegionPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ComponentRegionPriceRepository extends JpaRepository<ComponentRegionPrice, UUID> {
    List<ComponentRegionPrice> findByRegionCode(String regionCode);
    Optional<ComponentRegionPrice> findByComponent_CompCodeAndRegionCode(String compCode, String regionCode);
}
