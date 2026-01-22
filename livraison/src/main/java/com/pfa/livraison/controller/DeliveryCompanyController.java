package com.pfa.livraison.controller;

import com.pfa.livraison.dto.DeliveryPersonnelRegisterRequest;
import com.pfa.livraison.dto.CompanyDepotAndDailyStatsDto;
import com.pfa.livraison.dto.DeliveryDetailResponse;
import com.pfa.livraison.dto.DeliveryPersonnelResponse;
import com.pfa.livraison.dto.DriverRouteResponse;
import com.pfa.livraison.dto.UpdateCompanyDepotRequest;
import com.pfa.livraison.dto.UpdateDeliveryPersonnelRequest;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.service.DeliveryCompanyService;
import com.pfa.livraison.service.DeliveryPersonnelAuthService;
import com.pfa.livraison.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@PreAuthorize("hasRole('COMPANY')")
public class DeliveryCompanyController {

    private final DeliveryCompanyService deliveryCompanyService;
    private final DeliveryService deliveryService;
    private final DeliveryPersonnelAuthService deliveryPersonnelAuthService;

    private Long getAuthenticatedCompanyId() {
        return deliveryService.getCurrentAuthenticatedCompanyId();
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryDetailResponse>> getCompanyDeliveries(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<DeliveryDetailResponse> deliveries =
                deliveryService.getCompanyDeliveries(companyId, date);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/deliveries/{deliveryId}")
    public ResponseEntity<DeliveryDetailResponse> getDeliveryDetails(@PathVariable Long deliveryId) {
        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        DeliveryDetailResponse deliveryDetails =
                deliveryService.getDeliveryDetails(companyId, deliveryId);
        return ResponseEntity.ok(deliveryDetails);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<DriverRouteResponse>> getCompanyRoutes(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<DriverRouteResponse> routes =
                deliveryService.getCompanyRoutes(companyId, date);
        return ResponseEntity.ok(routes);
    }

    @PostMapping("/personnel")
    public ResponseEntity<?> addDeliveryPersonnel(
            @RequestBody DeliveryPersonnelRegisterRequest request) {

        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            deliveryPersonnelAuthService.registerDeliveryPersonnel(companyId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Livreur ajouté avec succès.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'ajout du livreur.");
        }
    }

    @GetMapping("/personnel")
    public ResponseEntity<List<DeliveryPersonnelResponse>> getCompanyPersonnel() {
        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<DeliveryPersonnelResponse> personnel =
                deliveryPersonnelAuthService.getDeliveryPersonnelByCompanyId(companyId);
        return ResponseEntity.ok(personnel);
    }

    @PutMapping("/personnel/{personnelId}")
    public ResponseEntity<?> updateDeliveryPersonnel(
            @PathVariable Long personnelId,
            @RequestBody UpdateDeliveryPersonnelRequest request) {

        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            DeliveryPersonnelResponse updatedPersonnel =
                    deliveryPersonnelAuthService.updateDeliveryPersonnel(
                            companyId, personnelId, request);
            return ResponseEntity.ok(updatedPersonnel);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la mise à jour du livreur.");
        }
    }

    @GetMapping("/depot")
    public ResponseEntity<CompanyDepotAndDailyStatsDto> getCompanyDepot(
            Principal principal) {

        String companyEmail = principal.getName();
        Long companyId =
                deliveryCompanyService.getCompanyIdByEmail(companyEmail);

        CompanyDepotAndDailyStatsDto responseDto =
                deliveryCompanyService
                        .getCompanyDepotDetailsWithDailyStats(companyId);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/depot")
    public ResponseEntity<DeliveryCompany> updateCompanyDepot(
            @RequestBody UpdateCompanyDepotRequest request) {

        Long companyId = getAuthenticatedCompanyId();
        if (companyId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            DeliveryCompany updatedCompany =
                    deliveryCompanyService.updateCompanyDepot(companyId, request);

            DeliveryCompany responseCompany = new DeliveryCompany();
            responseCompany.setCompanyName(updatedCompany.getCompanyName());
            responseCompany.setDepotLatitude(updatedCompany.getDepotLatitude());
            responseCompany.setDepotLongitude(updatedCompany.getDepotLongitude());

            return ResponseEntity.ok(responseCompany);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
