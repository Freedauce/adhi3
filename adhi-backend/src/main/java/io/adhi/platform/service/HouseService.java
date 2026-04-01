package io.adhi.platform.service;

import io.adhi.platform.dto.request.HouseTypeRequest;
import io.adhi.platform.entity.*;
import io.adhi.platform.entity.Component;
import io.adhi.platform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HouseService {

    private final HouseTypeRepository houseTypeRepo;
    private final ComponentRepository componentRepo;
    private final HouseComponentRepository houseComponentRepo;
    private final FileStorageService fileStorageService;

    public List<HouseType> findAll() {
        return houseTypeRepo.findAll();
    }

    public HouseType findById(UUID id) {
        return houseTypeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("House type not found: " + id));
    }

    @Transactional
    public HouseType create(HouseTypeRequest req, MultipartFile image) {
        if (houseTypeRepo.existsByModelCode(req.getModelCode())) {
            throw new RuntimeException("Model code already exists: " + req.getModelCode());
        }

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileStorageService.storeHouseImage(image);
        }

        HouseType house = HouseType.builder()
                .modelCode(req.getModelCode())
                .name(req.getName())
                .description(req.getDescription())
                .defaultBedrooms(req.getDefaultBedrooms())
                .defaultBathrooms(req.getDefaultBathrooms())
                .defaultFloorAreaM2(req.getDefaultFloorAreaM2())
                .assemblyWeeks(req.getAssemblyWeeks())
                .basePriceUsd(req.getBasePriceUsd())
                .imageUrl(imageUrl)
                .tag(req.getTag())
                .status(req.getStatus() != null ? req.getStatus() : "DRAFT")
                .build();

        house = houseTypeRepo.save(house);

        // Link components
        if (req.getComponents() != null) {
            linkComponents(house, req.getComponents());
        }

        return house;
    }

    @Transactional
    public HouseType update(UUID id, HouseTypeRequest req) {
        HouseType house = findById(id);
        house.setName(req.getName());
        house.setDescription(req.getDescription());
        house.setDefaultBedrooms(req.getDefaultBedrooms());
        house.setDefaultBathrooms(req.getDefaultBathrooms());
        house.setDefaultFloorAreaM2(req.getDefaultFloorAreaM2());
        house.setAssemblyWeeks(req.getAssemblyWeeks());
        house.setBasePriceUsd(req.getBasePriceUsd());
        house.setTag(req.getTag());
        if (req.getStatus() != null) house.setStatus(req.getStatus());

        if (req.getComponents() != null) {
            house.getHouseComponents().clear();
            houseTypeRepo.saveAndFlush(house);
            linkComponents(house, req.getComponents());
        }

        return houseTypeRepo.save(house);
    }

    @Transactional
    public String uploadImage(UUID houseId, MultipartFile image) {
        HouseType house = findById(houseId);
        String imageUrl = fileStorageService.storeHouseImage(image);
        house.setImageUrl(imageUrl);
        houseTypeRepo.save(house);
        return imageUrl;
    }

    @Transactional
    public void archive(UUID id) {
        HouseType house = findById(id);
        house.setStatus("ARCHIVED");
        houseTypeRepo.save(house);
    }

    private void linkComponents(HouseType house, List<HouseTypeRequest.HouseComponentLink> links) {
        for (HouseTypeRequest.HouseComponentLink link : links) {
            Component comp = componentRepo.findByCompCode(link.getCompCode())
                    .orElseThrow(() -> new RuntimeException("Component not found: " + link.getCompCode()));

            HouseComponent hc = HouseComponent.builder()
                    .houseType(house)
                    .component(comp)
                    .defaultRuleId(link.getDefaultRuleId())
                    .fixedQty(link.getFixedQty())
                    .sortOrder(link.getSortOrder())
                    .build();

            houseComponentRepo.save(hc);
        }
    }
}
