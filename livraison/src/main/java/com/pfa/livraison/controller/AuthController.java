package com.pfa.livraison.controller;

import com.pfa.livraison.dto.LoginRequest; 
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.dto.CompanyRegisterRequest;
import com.pfa.livraison.service.DeliveryCompanyAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth/company")
@RequiredArgsConstructor
public class AuthController {

    private final DeliveryCompanyAuthService deliveryCompanyAuthService;

    @PostMapping("/register")
    public ResponseEntity<String> registerCompany(@ModelAttribute CompanyRegisterRequest request) throws IOException {
        String token = deliveryCompanyAuthService.registerDeliveryCompany(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginCompany(@RequestBody LoginRequest authRequest) {
        AuthResponse response = deliveryCompanyAuthService.login(authRequest.getEmail(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public String testPublicAccess() {
        return "This is a public endpoint accessible without authentication.";
    }
}