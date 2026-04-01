package io.adhi.platform.repository;

import io.adhi.platform.entity.HouseComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface HouseComponentRepository extends JpaRepository<HouseComponent, UUID> {
    List<HouseComponent> findByHouseType_IdOrderBySortOrderAsc(UUID houseTypeId);
}
