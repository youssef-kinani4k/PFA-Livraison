package com.pfa.livraison.controller;

import com.pfa.livraison.dto.LoginRequest;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin") 
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginAdmin(@RequestBody LoginRequest authRequest) {
        AuthResponse response = adminAuthService.login(authRequest.getEmail(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }
}