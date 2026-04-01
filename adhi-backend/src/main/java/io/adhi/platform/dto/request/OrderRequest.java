package io.adhi.platform.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.UUID;

@Data
public class OrderRequest {
    @NotNull private UUID boqId;
    private String paymentMethod;
}
