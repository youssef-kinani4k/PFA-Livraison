package com.pfa.livraison.dto;

import com.pfa.livraison.model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {
    private Long id;
    private String clientEmail;
    private String companyName;
    private BigDecimal packageWeight;
    private BigDecimal pickupLat;
    private BigDecimal pickupLng;
    private BigDecimal deliveryLat;
    private BigDecimal deliveryLng;
    private LocalDate deliveryDate;
    private BigDecimal deliveryPrice;
    private DeliveryStatus status;
    private LocalDateTime createdAt;
}