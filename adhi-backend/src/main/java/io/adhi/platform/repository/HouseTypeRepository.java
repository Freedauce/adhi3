package io.adhi.platform.repository;

import io.adhi.platform.entity.HouseType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface HouseTypeRepository extends JpaRepository<HouseType, UUID> {
    Optional<HouseType> findByModelCode(String modelCode);
    boolean existsByModelCode(String modelCode);
}
