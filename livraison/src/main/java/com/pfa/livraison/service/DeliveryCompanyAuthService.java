package com.pfa.livraison.service;

import com.pfa.livraison.config.JwtService;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.dto.CompanyRegisterRequest;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.model.Role;
import com.pfa.livraison.repository.DeliveryCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeliveryCompanyAuthService {

    private final DeliveryCompanyRepository deliveryCompanyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final String UPLOAD_DIR = "uploads/company_papers/";

    public String registerDeliveryCompany(CompanyRegisterRequest request) throws IOException {
        if (deliveryCompanyRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un compte avec cet email existe déjà.");
        }

        String companyPaperPath = null;
        if (request.getCompanyPaper() != null && !request.getCompanyPaper().isEmpty()) {
            companyPaperPath = saveCompanyPaper(request.getCompanyPaper());
        }

        DeliveryCompany company = DeliveryCompany.builder()
                .companyName(request.getCompanyName())
                .patentNumber(request.getPatentNumber())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .companyPaperPath(companyPaperPath)
                .role(Role.COMPANY)
                .approved(false)
                .blocked(false)
                .build();

        deliveryCompanyRepository.save(company);

        return jwtService.generateToken(company);
    }

    public AuthResponse login(String email, String password) {
        DeliveryCompany company = deliveryCompanyRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BadCredentialsException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(password, company.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect.");
        }

        String token = jwtService.generateToken(company);

        return AuthResponse.builder()
                .token(token)
                .approved(company.isApproved())
                .blocked(company.isBlocked())
                .build();
    }

    private String saveCompanyPaper(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName =
                UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }
}
