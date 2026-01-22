package com.pfa.livraison.dto;

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
public class DriverRouteResponse {
    private String driverId;
    private String driverName;
    private int numberOfDeliveries;
    private double totalWeightKg;
    private Map<String, List<Map<String, Object>>> routeStops; 
    private LocalDate routeDate;
}