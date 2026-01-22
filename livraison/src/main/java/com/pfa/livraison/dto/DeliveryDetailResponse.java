package com.pfa.livraison.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDetailResponse {
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
    private String status; 
    private LocalDateTime createdAt;
    private Map<String, List<Map<String, Object>>> optimizedRoute;
}