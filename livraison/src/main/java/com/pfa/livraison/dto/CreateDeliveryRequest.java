package com.pfa.livraison.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeliveryRequest {

    @NotNull(message = "Package weight is required")
    @Min(value = 0, message = "Package weight must be positive")
    private BigDecimal packageWeight;

    @NotNull(message = "Pickup latitude is required")
    private BigDecimal pickupLat;

    @NotNull(message = "Pickup longitude is required")
    private BigDecimal pickupLng;

    @NotNull(message = "Delivery latitude is required")
    private BigDecimal deliveryLat;

    @NotNull(message = "Delivery longitude is required")
    private BigDecimal deliveryLng;

    @NotNull(message = "Delivery date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @FutureOrPresent(message = "Delivery date must be today or in the future")
    private LocalDate deliveryDate;

    @NotNull(message = "Company ID is required")
    private Long companyId;
}
