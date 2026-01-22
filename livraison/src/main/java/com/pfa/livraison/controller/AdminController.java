package com.pfa.livraison.controller;

import com.pfa.livraison.model.Client;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin1")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") 
public class AdminController {

    private final AdminService adminService;


    @GetMapping("/companies")
    public ResponseEntity<List<DeliveryCompany>> getAllDeliveryCompanies() {
        return ResponseEntity.ok(adminService.getAllDeliveryCompanies());
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<DeliveryCompany> getDeliveryCompanyDetails(@PathVariable Long id) {
        DeliveryCompany company = adminService.getDeliveryCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @PutMapping("/companies/{id}/block")
    public ResponseEntity<DeliveryCompany> blockDeliveryCompany(@PathVariable Long id) {
        DeliveryCompany updatedCompany = adminService.blockDeliveryCompany(id);
        return ResponseEntity.ok(updatedCompany);
    }

    @PutMapping("/companies/{id}/unblock")
    public ResponseEntity<DeliveryCompany> unblockDeliveryCompany(@PathVariable Long id) {
        DeliveryCompany updatedCompany = adminService.unblockDeliveryCompany(id);
        return ResponseEntity.ok(updatedCompany);
    }

    @PutMapping("/companies/{id}/approve")
    public ResponseEntity<DeliveryCompany> approveDeliveryCompany(@PathVariable Long id) {
        DeliveryCompany updatedCompany = adminService.approveDeliveryCompany(id);
        return ResponseEntity.ok(updatedCompany);
    }

    @PutMapping("/companies/{id}/reject")
    public ResponseEntity<DeliveryCompany> rejectDeliveryCompany(@PathVariable Long id) {
        DeliveryCompany updatedCompany = adminService.rejectDeliveryCompany(id);
        return ResponseEntity.ok(updatedCompany);
    }


    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(adminService.getAllClients());
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<Client> getClientDetails(@PathVariable Long id) {
        Client client = adminService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @PutMapping("/clients/{id}/block")
    public ResponseEntity<Client> blockClient(@PathVariable Long id) {
        Client updatedClient = adminService.blockClient(id);
        return ResponseEntity.ok(updatedClient);
    }

    @PutMapping("/clients/{id}/unblock")
    public ResponseEntity<Client> unblockClient(@PathVariable Long id) {
        Client updatedClient = adminService.unblockClient(id);
        return ResponseEntity.ok(updatedClient);
    }
}