package com.pfa.livraison.controller;

import com.pfa.livraison.dto.DeliveryPersonnelDailyRouteResponse;
import com.pfa.livraison.dto.DeliveryRouteEntryStatusUpdate;
import com.pfa.livraison.model.DeliveryPersonnel;
import com.pfa.livraison.service.DeliveryPersonnelDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/delivery-personnel/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DELIVERY_PERSONNEL')")
public class DeliveryPersonnelDashboardController {

    private final DeliveryPersonnelDashboardService dashboardService;

    @GetMapping("/routes/{date}")
    public ResponseEntity<DeliveryPersonnelDailyRouteResponse> getDailyRoutes(
            @PathVariable("date")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!(userDetails instanceof DeliveryPersonnel)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DeliveryPersonnel currentPersonnel = (DeliveryPersonnel) userDetails;
        Long personnelId = currentPersonnel.getId();
        Long companyId = currentPersonnel.getDeliveryCompany().getId();

        DeliveryPersonnelDailyRouteResponse response =
                dashboardService.getPersonnelDailyRoutes(companyId, personnelId, date);

        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/available-dates")
    public ResponseEntity<List<LocalDate>> getAvailableRouteDates(
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!(userDetails instanceof DeliveryPersonnel)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DeliveryPersonnel currentPersonnel = (DeliveryPersonnel) userDetails;
        Long personnelId = currentPersonnel.getId();
        Long companyId = currentPersonnel.getDeliveryCompany().getId();

        List<LocalDate> dates =
                dashboardService.getPersonnelAvailableRouteDates(companyId, personnelId);

        return ResponseEntity.ok(dates);
    }

    @PostMapping("/update-status")
    public ResponseEntity<String> updateRouteEntryStatus(
            @RequestBody DeliveryRouteEntryStatusUpdate updateRequest,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (!(userDetails instanceof DeliveryPersonnel)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DeliveryPersonnel currentPersonnel = (DeliveryPersonnel) userDetails;

        if (!currentPersonnel.getId()
                .equals(updateRequest.getDeliveryPersonnelId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Unauthorized to update this entry.");
        }

        try {
            boolean success =
                    dashboardService.updateDeliveryRouteEntryStatus(updateRequest);

            if (success) {
                return ResponseEntity.ok("Status updated successfully.");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update status.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }
}
