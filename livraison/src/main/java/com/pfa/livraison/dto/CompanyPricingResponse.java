package com.pfa.livraison.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPricingResponse {
    private Long id; 
    private String companyName;
    private BigDecimal prixDeBase; 
    private BigDecimal prixParKilogramme; 
}