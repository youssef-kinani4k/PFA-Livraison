package com.pfa.livraison.service;

import com.pfa.livraison.config.JwtService;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.dto.ClientRegisterRequest;
import com.pfa.livraison.model.Client;
import com.pfa.livraison.model.Role;
import com.pfa.livraison.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClientAuthService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String registerClient(ClientRegisterRequest request) {
        if (clientRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un compte client avec cet email existe déjà.");
        }

        Client client = Client.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .role(Role.CLIENT)
                .blocked(false)
                .build();

        clientRepository.save(client);

        return jwtService.generateToken(client);
    }

    public AuthResponse login(String email, String password) {
        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(password, client.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect.");
        }

        String token = jwtService.generateToken(client);

        return AuthResponse.builder()
                .token(token)
                .approved(true)
                .blocked(client.isBlocked())
                .build();
    }
}
