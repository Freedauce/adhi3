package io.adhi.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class HouseTypeRequest {
    @NotBlank private String modelCode;
    @NotBlank private String name;
    private String description;
    private int defaultBedrooms;
    private int defaultBathrooms;
    private int defaultFloorAreaM2;
    private int assemblyWeeks;
    @NotNull private BigDecimal basePriceUsd;
    private String tag;
    private String status;
    private List<HouseComponentLink> components;

    @Data
    public static class HouseComponentLink {
        @NotBlank private String compCode;
        private String defaultRuleId;
        private Integer fixedQty;
        private int sortOrder;
    }
}
