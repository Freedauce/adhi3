package io.adhi.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BOQRequest {
    @NotBlank private String houseTypeModelCode;
    @NotBlank private String regionCode;
    private int bedrooms;
    private int bathrooms;
    private int floorAreaM2;
    private int unitCount = 1; // Default to 1
    @NotBlank private String roofType;
    @NotBlank private String finishingGrade;
}
