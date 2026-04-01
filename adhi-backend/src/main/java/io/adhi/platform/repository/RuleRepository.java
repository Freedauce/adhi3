package io.adhi.platform.repository;

import io.adhi.platform.entity.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RuleRepository extends JpaRepository<Rule, UUID> {
    Optional<Rule> findByRuleCode(String ruleCode);
    List<Rule> findByOutputCompCode(String compCode);
    List<Rule> findByStatus(String status);
}
