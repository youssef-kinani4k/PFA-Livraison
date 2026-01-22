package com.pfa.livraison.service;

import com.pfa.livraison.config.JwtService;
import com.pfa.livraison.dto.AuthResponse;
import com.pfa.livraison.dto.DeliveryPersonnelRegisterRequest;
import com.pfa.livraison.dto.DeliveryPersonnelResponse;
import com.pfa.livraison.dto.UpdateDeliveryPersonnelRequest;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.model.DeliveryPersonnel;
import com.pfa.livraison.model.Role;
import com.pfa.livraison.repository.DeliveryCompanyRepository;
import com.pfa.livraison.repository.DeliveryPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryPersonnelAuthService {

    private final DeliveryPersonnelRepository deliveryPersonnelRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DeliveryCompanyRepository deliveryCompanyRepository;

    public AuthResponse login(String email, String password) {
        DeliveryPersonnel personnel = deliveryPersonnelRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Email ou mot de passe incorrect."));

        if (!passwordEncoder.matches(password, personnel.getPassword())) {
            throw new BadCredentialsException("Email ou mot de passe incorrect.");
        }

        String token = jwtService.generateToken(personnel);

        return AuthResponse.builder()
                .token(token)
                .approved(personnel.isApproved())
                .blocked(personnel.isBlocked())
                .build();
    }

    @Transactional
    public AuthResponse registerDeliveryPersonnel(
            Long companyId,
            DeliveryPersonnelRegisterRequest request) {

        if (deliveryPersonnelRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Un livreur avec cet email existe déjà.");
        }

        DeliveryCompany company = deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Company not found with ID: " + companyId));

        DeliveryPersonnel personnel = DeliveryPersonnel.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .capacityKg(request.getCapacityKg())
                .role(Role.DELIVERY_PERSONNEL)
                .approved(true)
                .blocked(false)
                .deliveryCompany(company)
                .build();

        deliveryPersonnelRepository.save(personnel);

        String jwtToken = jwtService.generateToken(personnel);

        return AuthResponse.builder()
                .token(jwtToken)
                .approved(true)
                .blocked(false)
                .build();
    }

    public List<DeliveryPersonnelResponse> getDeliveryPersonnelByCompanyId(
            Long companyId) {

        return deliveryPersonnelRepository
                .findByDeliveryCompany_Id(companyId)
                .stream()
                .map(this::mapToDeliveryPersonnelResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public DeliveryPersonnelResponse updateDeliveryPersonnel(
            Long companyId,
            Long personnelId,
            UpdateDeliveryPersonnelRequest request) {

        DeliveryPersonnel personnel = deliveryPersonnelRepository.findById(personnelId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery personnel not found with ID: " + personnelId));

        if (!personnel.getDeliveryCompany().getId().equals(companyId)) {
            throw new IllegalStateException("Livreur non trouvé dans cette société.");
        }

        personnel.setFirstName(request.getFirstName());
        personnel.setLastName(request.getLastName());
        personnel.setPhone(request.getPhone());
        personnel.setCapacityKg(request.getCapacityKg());
        personnel.setBlocked(request.isBlocked());

        if (!personnel.getEmail().equals(request.getEmail())) {
            if (deliveryPersonnelRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException(
                        "Cet email est déjà utilisé par un autre livreur.");
            }
            personnel.setEmail(request.getEmail());
        }

        DeliveryPersonnel updatedPersonnel =
                deliveryPersonnelRepository.save(personnel);

        return mapToDeliveryPersonnelResponse(updatedPersonnel);
    }

    private DeliveryPersonnelResponse mapToDeliveryPersonnelResponse(
            DeliveryPersonnel personnel) {

        return DeliveryPersonnelResponse.builder()
                .id(personnel.getId())
                .firstName(personnel.getFirstName())
                .lastName(personnel.getLastName())
                .email(personnel.getEmail())
                .phone(personnel.getPhone())
                .capacityKg(personnel.getCapacityKg())
                .blocked(personnel.isBlocked())
                .build();
    }
}
