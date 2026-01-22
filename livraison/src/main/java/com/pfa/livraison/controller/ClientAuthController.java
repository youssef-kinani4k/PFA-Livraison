package com.pfa.livraison.controller;

import com.pfa.livraison.dto.LoginRequest;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.dto.ClientRegisterRequest;
import com.pfa.livraison.service.ClientAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/client") 
@RequiredArgsConstructor
public class ClientAuthController {

    private final ClientAuthService clientAuthService;

    @PostMapping("/register")
    public ResponseEntity<String> registerClient(@RequestBody ClientRegisterRequest request) {
        String token = clientAuthService.registerClient(request);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginClient(@RequestBody LoginRequest authRequest) {
        AuthResponse response = clientAuthService.login(authRequest.getEmail(), authRequest.getPassword());
        return ResponseEntity.ok(response);
    }

}