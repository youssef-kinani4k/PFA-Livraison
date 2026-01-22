package com.pfa.livraison.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> getCompanyDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();

        return ResponseEntity.ok(
            "Welcome, " + currentPrincipalName + ", to your **Company Dashboard**! This is exclusive content for companies."
        );
    }

    @GetMapping("/manage-deliveries")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<String> manageDeliveries() {
        return ResponseEntity.ok("This is the company's delivery management page.");
    }
}
