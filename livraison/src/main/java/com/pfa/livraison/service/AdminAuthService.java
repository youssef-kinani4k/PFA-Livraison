package com.pfa.livraison.service;

import com.pfa.livraison.config.JwtService;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.model.Admin;
import com.pfa.livraison.model.Role;
import com.pfa.livraison.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Admin createAdmin(String email, String rawPassword) {
        if (adminRepository.existsByEmail(email)) {
            throw new RuntimeException("Admin with this email already exists.");
        }

        Admin newAdmin = Admin.builder()
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .role(Role.ADMIN)
                .build();

        return adminRepository.save(newAdmin);
    }

    public AuthResponse login(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect.");
        }

        String token = jwtService.generateToken(admin);

        return AuthResponse.builder()
                .token(token)
                .approved(true)
                .blocked(false)
                .build();
    }
}
