package io.adhi.platform.controller;

import io.adhi.platform.entity.Region;
import io.adhi.platform.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionRepository regionRepo;

    @GetMapping
    public ResponseEntity<List<Region>> findAll() {
        return ResponseEntity.ok(regionRepo.findAll());
    }

    @GetMapping("/{code}")
    public ResponseEntity<Region> findByCode(@PathVariable String code) {
        return ResponseEntity.ok(regionRepo.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Region not found: " + code)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Region> create(@RequestBody Region region) {
        return ResponseEntity.ok(regionRepo.save(region));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Region> update(@PathVariable UUID id, @RequestBody Region req) {
        Region region = regionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Region not found: " + id));
        region.setLabel(req.getLabel());
        region.setCurrency(req.getCurrency());
        region.setFxRateToUsd(req.getFxRateToUsd());
        region.setTaxRatePct(req.getTaxRatePct());
        region.setTaxLabel(req.getTaxLabel());
        region.setActive(req.isActive());
        return ResponseEntity.ok(regionRepo.save(region));
    }
}
