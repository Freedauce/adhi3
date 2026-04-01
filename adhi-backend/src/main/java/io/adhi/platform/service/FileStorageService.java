package io.adhi.platform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${adhi.file-storage.houses-dir}")
    private String housesDir;

    @Value("${adhi.file-storage.base-url}")
    private String baseUrl;

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(Path.of(housesDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + housesDir, e);
        }
    }

    public String storeHouseImage(MultipartFile file) {
        String ext = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        Path target = Path.of(housesDir).resolve(filename);

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store house image", e);
        }

        return baseUrl + "/houses/" + filename;
    }

    private String getExtension(String filename) {
        if (filename == null) return ".jpg";
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(dot) : ".jpg";
    }
}
