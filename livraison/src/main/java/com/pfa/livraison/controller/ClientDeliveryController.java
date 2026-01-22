package com.pfa.livraison.controller;

import com.pfa.livraison.dto.CreateDeliveryRequest;
import com.pfa.livraison.dto.DeliveryHistoryResponse;
import com.pfa.livraison.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/client/deliveries")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CLIENT')")
public class ClientDeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<DeliveryHistoryResponse> createDelivery(
            @Valid @RequestBody CreateDeliveryRequest request) {
        DeliveryHistoryResponse newDelivery = deliveryService.createDelivery(request);
        return new ResponseEntity<>(newDelivery, HttpStatus.CREATED);
    }

    @GetMapping("/history")
    public ResponseEntity<List<DeliveryHistoryResponse>> getDeliveryHistory() {
        List<DeliveryHistoryResponse> history = deliveryService.getClientDeliveries();
        return ResponseEntity.ok(history);
    }
}