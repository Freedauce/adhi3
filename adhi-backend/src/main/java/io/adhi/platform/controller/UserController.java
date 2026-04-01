package io.adhi.platform.controller;

import io.adhi.platform.entity.User;
import io.adhi.platform.enums.UserStatus;
import io.adhi.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepo;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<User> approve(@PathVariable UUID id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setStatus(UserStatus.ACTIVE);
        return ResponseEntity.ok(userRepo.save(user));
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<User> suspend(@PathVariable UUID id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setStatus(UserStatus.SUSPENDED);
        return ResponseEntity.ok(userRepo.save(user));
    }
}
