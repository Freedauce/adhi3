package io.adhi.platform.controller;

import io.adhi.platform.dto.request.HouseTypeRequest;
import io.adhi.platform.entity.HouseType;
import io.adhi.platform.service.HouseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/houses")
@RequiredArgsConstructor
public class HouseController {

    private final HouseService houseService;

    @GetMapping
    public ResponseEntity<List<HouseType>> findAll() {
        return ResponseEntity.ok(houseService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseType> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(houseService.findById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HouseType> create(
            @RequestPart("house") @Valid HouseTypeRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        return ResponseEntity.ok(houseService.create(req, image));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HouseType> update(@PathVariable UUID id, @Valid @RequestBody HouseTypeRequest req) {
        return ResponseEntity.ok(houseService.update(id, req));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable UUID id,
            @RequestParam("file") MultipartFile file) {
        String url = houseService.uploadImage(id, file);
        return ResponseEntity.ok(Map.of("imageUrl", url));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> archive(@PathVariable UUID id) {
        houseService.archive(id);
        return ResponseEntity.noContent().build();
    }
}
