package com.pfa.livraison.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDeliveryPersonnelRequest {
    private String firstName;
    private String lastName;
    private String email; 
    private String phone;
    private double capacityKg;
    private boolean blocked;
}