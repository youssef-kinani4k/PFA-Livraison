package com.pfa.livraison.controller;

import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.service.DeliveryCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController {

    private final DeliveryCompanyService deliveryCompanyService;

    @GetMapping
    public ResponseEntity<List<DeliveryCompany>> getAllDeliveryCompanies() {
        return ResponseEntity.ok(deliveryCompanyService.getAllDeliveryCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryCompany> getCompanyDetails(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryCompanyService.getCompanyById(id));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<DeliveryCompany> approveCompany(@PathVariable Long id, @RequestParam boolean approved) {
        return ResponseEntity.ok(deliveryCompanyService.updateCompanyApprovalStatus(id, approved));
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<DeliveryCompany> blockCompany(@PathVariable Long id, @RequestParam boolean blocked) {
        return ResponseEntity.ok(deliveryCompanyService.updateCompanyBlockingStatus(id, blocked));
    }

    @GetMapping("/filter/approved")
    public ResponseEntity<List<DeliveryCompany>> getApprovedCompanies(@RequestParam boolean approved) {
        return ResponseEntity.ok(deliveryCompanyService.getCompaniesByApprovedStatus(approved));
    }

    @GetMapping("/filter/blocked")
    public ResponseEntity<List<DeliveryCompany>> getBlockedCompanies(@RequestParam boolean blocked) {
        return ResponseEntity.ok(deliveryCompanyService.getCompaniesByBlockedStatus(blocked));
    }
}