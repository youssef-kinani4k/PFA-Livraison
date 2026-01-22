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
public class RoutingRequest {
    private List<PickupDeliveryRequest> deliveries;
    private List<DriverRequest> drivers;
    private List<BigDecimal> depotLocation; 
}