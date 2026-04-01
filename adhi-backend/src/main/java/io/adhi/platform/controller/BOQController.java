package io.adhi.platform.controller;

import io.adhi.platform.dto.request.BOQRequest;
import io.adhi.platform.entity.BOQ;
import io.adhi.platform.entity.User;
import io.adhi.platform.service.BOQService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/boq")
@RequiredArgsConstructor
public class BOQController {

    private final BOQService boqService;

    /**
     * Public — Generate a BOQ preview (not saved).
     */
    @PostMapping("/preview")
    public ResponseEntity<BOQ> preview(@Valid @RequestBody BOQRequest req) {
        return ResponseEntity.ok(boqService.preview(req));
    }

    /**
     * Authenticated — Generate and save a BOQ (status: DRAFT).
     */
    @PostMapping("/generate")
    public ResponseEntity<BOQ> generate(@Valid @RequestBody BOQRequest req,
                                         @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boqService.generate(req, user));
    }

    /**
     * Lock BOQ (DRAFT → LOCKED).
     */
    @PutMapping("/{id}/lock")
    public ResponseEntity<BOQ> lock(@PathVariable UUID id) {
        return ResponseEntity.ok(boqService.lock(id));
    }

    /**
     * Approve BOQ (LOCKED → APPROVED).
     */
    @PutMapping("/{id}/approve")
    public ResponseEntity<BOQ> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(boqService.approve(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BOQ> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(boqService.findById(id));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BOQ>> findMyBOQs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(boqService.findByUser(user.getId()));
    }
}
