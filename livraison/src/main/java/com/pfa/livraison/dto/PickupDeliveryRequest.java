package com.pfa.livraison.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PickupDeliveryRequest {
    private String id_livraison;
    private List<BigDecimal> localisation_recuperation; 
    private List<BigDecimal> localisation_livraison;   
    private BigDecimal taille; 
}