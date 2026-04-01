package io.adhi.platform.controller;

import io.adhi.platform.entity.Rule;
import io.adhi.platform.repository.RuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/rules")
@RequiredArgsConstructor
public class RuleController {

    private final RuleRepository ruleRepo;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Rule>> findAll() {
        return ResponseEntity.ok(ruleRepo.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Rule> create(@RequestBody Rule rule) {
        if (ruleRepo.findByRuleCode(rule.getRuleCode()).isPresent()) {
            throw new RuntimeException("Rule code already exists: " + rule.getRuleCode());
        }
        return ResponseEntity.ok(ruleRepo.save(rule));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Rule> update(@PathVariable UUID id, @RequestBody Rule req) {
        Rule rule = ruleRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Rule not found: " + id));
        rule.setLayer(req.getLayer());
        rule.setTrigger(req.getTrigger());
        rule.setFormula(req.getFormula());
        rule.setOutputCompCode(req.getOutputCompCode());
        rule.setStatus(req.getStatus());
        rule.setVersion(rule.getVersion() + 1);
        return ResponseEntity.ok(ruleRepo.save(rule));
    }
}
