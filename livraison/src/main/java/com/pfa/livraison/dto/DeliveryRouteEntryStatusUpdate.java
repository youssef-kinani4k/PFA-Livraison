package com.pfa.livraison.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRouteEntryStatusUpdate {
    private Long deliveryId; 
    private String type;
    private Long deliveryPersonnelId;
}