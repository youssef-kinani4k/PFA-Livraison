package com.pfa.livraison.service;

import com.pfa.livraison.dto.CompanyDepotAndDailyStatsDto;
import com.pfa.livraison.dto.CompanyPricingResponse;
import com.pfa.livraison.dto.UpdateCompanyDepotRequest;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.model.DeliveryCompanyDailyStats;
import com.pfa.livraison.model.Role;
import com.pfa.livraison.repository.DeliveryCompanyDailyStatsRepository;
import com.pfa.livraison.repository.DeliveryCompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryCompanyService {

    private final DeliveryCompanyRepository deliveryCompanyRepository;
    private final DeliveryCompanyDailyStatsRepository dailyStatsRepository;
    private final MongoTemplate mongoTemplate;

    public List<CompanyPricingResponse> getApprovedCompanyPricing() {
        List<DeliveryCompany> approvedCompanies =
                deliveryCompanyRepository.findByApprovedTrueAndBlockedFalse();

        return approvedCompanies.stream()
                .map(this::mapToCompanyPricingResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryCompany> getAllDeliveryCompanies() {
        return deliveryCompanyRepository.findAll();
    }

    @Transactional
    public DeliveryCompany updateCompanyApprovalStatus(Long companyId, boolean approved) {
        DeliveryCompany company = deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));
        company.setApproved(approved);
        return deliveryCompanyRepository.save(company);
    }

    @Transactional
    public DeliveryCompany updateCompanyBlockingStatus(Long companyId, boolean blocked) {
        DeliveryCompany company = deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));
        company.setBlocked(blocked);
        return deliveryCompanyRepository.save(company);
    }

    public List<DeliveryCompany> getCompaniesByApprovedStatus(boolean approved) {
        return deliveryCompanyRepository.findByApproved(approved);
    }

    public List<DeliveryCompany> getCompaniesByBlockedStatus(boolean blocked) {
        return deliveryCompanyRepository.findByBlocked(blocked);
    }

    public CompanyDepotAndDailyStatsDto getCompanyDepotDetailsWithDailyStats(Long companyId) {
        DeliveryCompany company = deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));

        String mongoId = String.valueOf(companyId);

        log.info("Attempting to find MongoDB daily stats for companyId (String): {}", mongoId);

        Query query = new Query(Criteria.where("_id").is(mongoId));
        log.info("MongoDB query generated: {}", query.toString());

        Optional<DeliveryCompanyDailyStats> dailyStatsOptional =
                dailyStatsRepository.findById(mongoId);

        if (dailyStatsOptional.isPresent()) {
            DeliveryCompanyDailyStats dailyStats = dailyStatsOptional.get();
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);

            try {
                log.info(
                        "MongoDB daily stats FOUND for companyId {}. Full Data (JSON): \n{}",
                        mongoId,
                        objectMapper.writeValueAsString(dailyStats)
                );
            } catch (Exception e) {
                log.error("Error serializing dailyStats to JSON for logging", e);
                log.info(
                        "MongoDB daily stats FOUND for companyId {}. Data: {}",
                        mongoId,
                        dailyStats
                );
            }
        } else {
            log.warn("MongoDB daily stats NOT FOUND for companyId {}", mongoId);
        }

        DeliveryCompanyDailyStats dailyStats =
                dailyStatsOptional.orElse(null);

        return CompanyDepotAndDailyStatsDto.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .email(company.getEmail())
                .phone(company.getPhone())
                .depotLatitude(company.getDepotLatitude())
                .depotLongitude(company.getDepotLongitude())
                .approved(company.isApproved())
                .blocked(company.isBlocked())
                .dailyStats(dailyStats)
                .build();
    }

    private CompanyPricingResponse mapToCompanyPricingResponse(
            DeliveryCompany company) {

        return CompanyPricingResponse.builder()
                .id(company.getId())
                .companyName(company.getCompanyName())
                .prixDeBase(company.getPrixDeBase())
                .prixParKilogramme(company.getPrixParKilogramme())
                .build();
    }

    public DeliveryCompany getCompanyById(Long companyId) {
        return deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));
    }

    public Long getCompanyIdByEmail(String email) {
        return deliveryCompanyRepository.findByEmail(email)
                .map(DeliveryCompany::getId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with email: " + email));
    }

    public DeliveryCompany getCompanyDetails(Long companyId) {
        return deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));
    }

    @Transactional
    public DeliveryCompany updateCompanyDepot(
            Long companyId,
            UpdateCompanyDepotRequest request) {

        DeliveryCompany company = deliveryCompanyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery company not found with ID: " + companyId));

        company.setDepotLatitude(request.getNewDepotLat());
        company.setDepotLongitude(request.getNewDepotLng());
        company.setRole(Role.COMPANY);

        DeliveryCompany savedCompany =
                deliveryCompanyRepository.save(company);

        if (savedCompany.getRole() == null) {
            System.err.println(
                    "FATAL ERROR: Role is NULL after save for company " + companyId);
        }

        return savedCompany;
    }
}
