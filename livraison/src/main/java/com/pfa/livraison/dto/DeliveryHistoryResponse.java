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
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryHistoryResponse {
    private Long id; 
    private String companyName;
    private BigDecimal packageWeight;
    private LocalDate deliveryDate;
    private BigDecimal deliveryPrice;
    private DeliveryStatus status;
    private LocalDateTime createdAt;
}