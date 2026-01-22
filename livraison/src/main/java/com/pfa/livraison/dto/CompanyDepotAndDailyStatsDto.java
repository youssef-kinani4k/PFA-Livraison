package com.pfa.livraison.dto;

import com.pfa.livraison.model.DeliveryCompanyDailyStats; 
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CompanyDepotAndDailyStatsDto {
    private Long id; 
    private String companyName;
    private String email;
    private String phone;
    private BigDecimal depotLatitude;
    private BigDecimal depotLongitude;
    private boolean approved;
    private boolean blocked;

    private DeliveryCompanyDailyStats dailyStats;
}