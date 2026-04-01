package io.adhi.platform.repository;

import io.adhi.platform.entity.Component;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ComponentRepository extends JpaRepository<Component, UUID> {
    Optional<Component> findByCompCode(String compCode);
}
