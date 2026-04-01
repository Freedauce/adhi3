package io.adhi.platform.controller;

import io.adhi.platform.entity.Component;
import io.adhi.platform.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/components")
@RequiredArgsConstructor
public class ComponentController {

    private final ComponentRepository componentRepo;

    @GetMapping
    public ResponseEntity<List<Component>> findAll() {
        return ResponseEntity.ok(componentRepo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Component> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(componentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Component not found: " + id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Component> create(@RequestBody Component component) {
        return ResponseEntity.ok(componentRepo.save(component));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Component> update(@PathVariable UUID id, @RequestBody Component req) {
        Component comp = componentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Component not found: " + id));
        comp.setName(req.getName());
        comp.setCategory(req.getCategory());
        comp.setType(req.getType());
        comp.setUnit(req.getUnit());
        comp.setDescription(req.getDescription());
        return ResponseEntity.ok(componentRepo.save(comp));
    }
}
