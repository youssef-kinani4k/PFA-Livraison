package com.pfa.livraison.dto;

import com.pfa.livraison.model.DeliveryRouteEntry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPersonnelDailyRouteResponse {
    private String personnelId; 
    private LocalDate date;
    private Map<String, List<DeliveryRouteEntry>> routes; 
}