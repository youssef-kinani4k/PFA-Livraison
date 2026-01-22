package com.pfa.livraison.controller;

import com.pfa.livraison.dto.LoginRequest;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.service.DeliveryPersonnelAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/personnel")
@RequiredArgsConstructor
public class DeliveryPersonnelAuthController {

    private final DeliveryPersonnelAuthService deliveryPersonnelAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginPersonnel(@RequestBody LoginRequest authRequest) {
        AuthResponse response = deliveryPersonnelAuthService.login(authRequest.getEmail(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }
}