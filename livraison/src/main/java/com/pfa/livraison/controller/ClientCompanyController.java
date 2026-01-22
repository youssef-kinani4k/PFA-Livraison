package com.pfa.livraison.controller;

import com.pfa.livraison.dto.CompanyPricingResponse;
import com.pfa.livraison.service.DeliveryCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENT')")
public class ClientCompanyController {

    private final DeliveryCompanyService deliveryCompanyService;

    @GetMapping("/delivery-companies-pricing")
    public ResponseEntity<List<CompanyPricingResponse>> getDeliveryCompaniesPricing() {
        List<CompanyPricingResponse> companies = deliveryCompanyService.getApprovedCompanyPricing();
        return ResponseEntity.ok(companies);
    }
}