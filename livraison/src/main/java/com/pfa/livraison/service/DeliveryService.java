package com.pfa.livraison.service;

import com.pfa.livraison.dto.CreateDeliveryRequest;
import com.pfa.livraison.dto.DeliveryDetailResponse;
import com.pfa.livraison.dto.DeliveryHistoryResponse;
import com.pfa.livraison.dto.DriverRouteResponse;
import com.pfa.livraison.model.Client;
import com.pfa.livraison.model.DailyDeliveryDetails;
import com.pfa.livraison.model.Delivery;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.model.DeliveryCompanyDailyStats;
import com.pfa.livraison.model.DeliveryEntry;
import com.pfa.livraison.model.DeliveryRouteEntry;
import com.pfa.livraison.model.DeliveryStatus;
import com.pfa.livraison.model.DeliveryPersonnel;
import com.pfa.livraison.repository.ClientRepository;
import com.pfa.livraison.repository.DeliveryCompanyDailyStatsRepository;
import com.pfa.livraison.repository.DeliveryRepository;
import com.pfa.livraison.repository.DeliveryPersonnelRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryCompanyService deliveryCompanyService;
    private final ClientRepository clientRepository;
    private final DeliveryCompanyDailyStatsRepository dailyStatsRepository;
    private final DeliveryPersonnelRepository deliveryPersonnelRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public DeliveryHistoryResponse createDelivery(CreateDeliveryRequest request) {
        Long clientId = getCurrentAuthenticatedClientId();

        if (clientId == null) {
            throw new IllegalStateException("Authenticated client ID not found.");
        }

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Client with ID " + clientId + " not found."));

        if (request.getDeliveryDate()
                .isBefore(LocalDate.now().plus(1, ChronoUnit.DAYS))) {
            throw new IllegalArgumentException(
                    "Delivery date must be at least tomorrow.");
        }

        DeliveryCompany company =
                deliveryCompanyService.getCompanyById(
                        request.getCompanyId());

        if (!company.isApproved() || company.isBlocked()) {
            throw new IllegalArgumentException(
                    "Selected delivery company is not approved or is blocked.");
        }

        BigDecimal basePrice = company.getPrixDeBase();
        BigDecimal pricePerKg = company.getPrixParKilogramme();
        BigDecimal calculatedPrice =
                basePrice.add(
                        pricePerKg.multiply(
                                request.getPackageWeight()));

        Delivery newDelivery = Delivery.builder()
                .client(client)
                .company(company)
                .packageWeight(request.getPackageWeight())
                .pickupLocationLatitude(request.getPickupLat())
                .pickupLocationLongitude(request.getPickupLng())
                .deliveryLocationLatitude(request.getDeliveryLat())
                .deliveryLocationLongitude(request.getDeliveryLng())
                .deliveryDate(request.getDeliveryDate())
                .deliveryPrice(calculatedPrice)
                .status(DeliveryStatus.EN_ATTENTE)
                .createdAt(LocalDateTime.now())
                .build();

        Delivery savedDelivery =
                deliveryRepository.save(newDelivery);

        saveDeliveryToMongo(savedDelivery);

        return mapToDeliveryHistoryResponse(savedDelivery);
    }

    private void saveDeliveryToMongo(Delivery delivery) {
        String companyMongoId =
                String.valueOf(delivery.getCompany().getId());
        String deliveryDateStr =
                delivery.getDeliveryDate()
                        .format(DateTimeFormatter.ISO_LOCAL_DATE);

        Optional<DeliveryCompanyDailyStats> existingStats =
                dailyStatsRepository.findById(companyMongoId);

        DeliveryCompanyDailyStats companyStats;

        if (existingStats.isPresent()) {
            companyStats = existingStats.get();
        } else {
            companyStats = new DeliveryCompanyDailyStats();
            companyStats.setCompanyId(companyMongoId);
            companyStats.setDailyData(new HashMap<>());
        }

        Map<String, DailyDeliveryDetails> dailyData =
                companyStats.getDailyData();

        DailyDeliveryDetails currentDayDetails =
                dailyData.getOrDefault(
                        deliveryDateStr,
                        new DailyDeliveryDetails());

        DeliveryEntry deliveryEntry =
                new DeliveryEntry(
                        String.valueOf(delivery.getId()),
                        List.of(
                                delivery.getPickupLocationLatitude(),
                                delivery.getPickupLocationLongitude()),
                        List.of(
                                delivery.getDeliveryLocationLatitude(),
                                delivery.getDeliveryLocationLongitude()),
                        delivery.getPackageWeight());

        currentDayDetails.getLivraison().add(deliveryEntry);

        if (currentDayDetails.getTrajet() == null) {
            currentDayDetails.setTrajet(new HashMap<>());
        }

        dailyData.put(deliveryDateStr, currentDayDetails);
        companyStats.setDailyData(dailyData);

        dailyStatsRepository.save(companyStats);
    }

    public List<DeliveryHistoryResponse> getClientDeliveries() {
        Long clientId = getCurrentAuthenticatedClientId();

        if (clientId == null) {
            throw new IllegalStateException(
                    "Authenticated client ID not found.");
        }

        List<Delivery> deliveries =
                deliveryRepository
                        .findByClientIdOrderByCreatedAtDesc(clientId);

        return deliveries.stream()
                .map(this::mapToDeliveryHistoryResponse)
                .collect(Collectors.toList());
    }

    public List<DeliveryDetailResponse> getCompanyDeliveries(
            Long companyId,
            LocalDate deliveryDate) {

        List<Delivery> deliveries;

        if (deliveryDate != null) {
            deliveries =
                    deliveryRepository
                            .findByCompanyIdAndDeliveryDateOrderByCreatedAtDesc(
                                    companyId,
                                    deliveryDate);
        } else {
            deliveries =
                    deliveryRepository
                            .findByCompanyIdOrderByCreatedAtDesc(
                                    companyId);
        }

        return deliveries.stream()
                .map(this::mapToDeliveryDetailResponse)
                .collect(Collectors.toList());
    }

    public DeliveryDetailResponse getDeliveryDetails(
            Long companyId,
            Long deliveryId) {

        Delivery delivery =
                deliveryRepository.findById(deliveryId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Delivery not found with ID: " +
                                                deliveryId));

        if (!delivery.getCompany().getId().equals(companyId)) {
            throw new IllegalStateException(
                    "Delivery does not belong to the authenticated company.");
        }

        DeliveryDetailResponse response =
                mapToDeliveryDetailResponse(delivery);

        String companyMongoId = String.valueOf(companyId);
        String deliveryDateStr =
                delivery.getDeliveryDate()
                        .format(DateTimeFormatter.ISO_LOCAL_DATE);

        Optional<DeliveryCompanyDailyStats> companyStatsOpt =
                dailyStatsRepository.findById(companyMongoId);

        companyStatsOpt.ifPresent(companyStats -> {
            DailyDeliveryDetails dailyDetails =
                    companyStats.getDailyData().get(deliveryDateStr);

            if (dailyDetails != null &&
                    dailyDetails.getTrajet() != null) {

                for (Map.Entry<String, List<DeliveryRouteEntry>> entry :
                        dailyDetails.getTrajet().entrySet()) {

                    List<DeliveryRouteEntry> route = entry.getValue();
                    boolean found = false;
                    List<Map<String, Object>> routeStopsForDelivery =
                            new ArrayList<>();

                    for (DeliveryRouteEntry routeEntry : route) {
                        if (routeEntry.getIdLivraison() != null &&
                                routeEntry.getIdLivraison()
                                        .equals(String.valueOf(deliveryId))) {
                            found = true;
                        }

                        Map<String, Object> stopMap = new HashMap<>();
                        stopMap.put(
                                "idLivraison",
                                routeEntry.getIdLivraison());
                        stopMap.put("type", routeEntry.getType());
                        stopMap.put(
                                "localisation",
                                routeEntry.getLocalisation());
                        stopMap.put("taille", routeEntry.getTaille());
                        routeStopsForDelivery.add(stopMap);
                    }

                    if (found) {
                        response.setOptimizedRoute(
                                Map.of(
                                        entry.getKey(),
                                        routeStopsForDelivery));
                        break;
                    }
                }
            }
        });

        return response;
    }

    public List<DriverRouteResponse> getCompanyRoutes(
            Long companyId,
            LocalDate routeDate) {

        String companyMongoId = String.valueOf(companyId);
        String dateKey =
                routeDate.format(DateTimeFormatter.ISO_LOCAL_DATE);

        Optional<DeliveryCompanyDailyStats> companyStatsOpt =
                dailyStatsRepository.findById(companyMongoId);

        if (companyStatsOpt.isEmpty()) {
            return new ArrayList<>();
        }

        DeliveryCompanyDailyStats companyStats =
                companyStatsOpt.get();

        DailyDeliveryDetails dailyDetails =
                companyStats.getDailyData().get(dateKey);

        if (dailyDetails == null ||
                dailyDetails.getTrajet() == null ||
                dailyDetails.getTrajet().isEmpty()) {
            return new ArrayList<>();
        }

        List<DriverRouteResponse> driverRoutes = new ArrayList<>();

        for (Map.Entry<String, List<DeliveryRouteEntry>> entry :
                dailyDetails.getTrajet().entrySet()) {

            String driverIdStr = entry.getKey();
            List<DeliveryRouteEntry> routeEntries = entry.getValue();

            Optional<DeliveryPersonnel> personnelOpt =
                    deliveryPersonnelRepository.findById(
                            Long.valueOf(driverIdStr));

            String driverName =
                    personnelOpt
                            .map(p ->
                                    p.getFirstName() + " " +
                                    p.getLastName())
                            .orElse("Unknown Driver");

            int numberOfDeliveries =
                    (int) routeEntries.stream()
                            .filter(re ->
                                    "livraison".equals(re.getType()))
                            .count();

            double totalWeightKg =
                    routeEntries.stream()
                            .filter(re -> re.getTaille() > 0)
                            .mapToDouble(DeliveryRouteEntry::getTaille)
                            .sum();

            List<Map<String, Object>> mappedRouteStops =
                    routeEntries.stream()
                            .map(routeEntry -> {
                                Map<String, Object> stopMap =
                                        new HashMap<>();
                                stopMap.put(
                                        "idLivraison",
                                        routeEntry.getIdLivraison());
                                stopMap.put(
                                        "type",
                                        routeEntry.getType());
                                stopMap.put(
                                        "localisation",
                                        routeEntry.getLocalisation());
                                stopMap.put(
                                        "taille",
                                        routeEntry.getTaille());
                                return stopMap;
                            })
                            .collect(Collectors.toList());

            driverRoutes.add(
                    DriverRouteResponse.builder()
                            .driverId(driverIdStr)
                            .driverName(driverName)
                            .numberOfDeliveries(numberOfDeliveries)
                            .totalWeightKg(totalWeightKg)
                            .routeStops(
                                    Map.of(
                                            driverIdStr,
                                            mappedRouteStops))
                            .routeDate(routeDate)
                            .build());
        }

        return driverRoutes;
    }

    private DeliveryHistoryResponse mapToDeliveryHistoryResponse(
            Delivery delivery) {

        return DeliveryHistoryResponse.builder()
                .id(delivery.getId())
                .companyName(
                        delivery.getCompany() != null
                                ? delivery.getCompany().getCompanyName()
                                : "Non assigné")
                .packageWeight(delivery.getPackageWeight())
                .deliveryDate(delivery.getDeliveryDate())
                .deliveryPrice(delivery.getDeliveryPrice())
                .status(delivery.getStatus())
                .createdAt(delivery.getCreatedAt())
                .build();
    }

    private DeliveryDetailResponse mapToDeliveryDetailResponse(
            Delivery delivery) {

        return DeliveryDetailResponse.builder()
                .id(delivery.getId())
                .clientEmail(
                        delivery.getClient() != null
                                ? delivery.getClient().getEmail()
                                : "N/A")
                .companyName(
                        delivery.getCompany() != null
                                ? delivery.getCompany().getCompanyName()
                                : "Non assigné")
                .packageWeight(delivery.getPackageWeight())
                .pickupLat(delivery.getPickupLocationLatitude())
                .pickupLng(delivery.getPickupLocationLongitude())
                .deliveryLat(delivery.getDeliveryLocationLatitude())
                .deliveryLng(delivery.getDeliveryLocationLongitude())
                .deliveryDate(delivery.getDeliveryDate())
                .deliveryPrice(delivery.getDeliveryPrice())
                .status(delivery.getStatus().name())
                .createdAt(delivery.getCreatedAt())
                .build();
    }

    private Long getCurrentAuthenticatedClientId() {
        Object principal =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (principal instanceof UserDetails) {
            String email =
                    ((UserDetails) principal).getUsername();
            Optional<Client> clientOptional =
                    clientRepository.findByEmail(email);
            return clientOptional.map(Client::getId).orElse(null);
        } else if (principal instanceof String) {
            String email = (String) principal;
            Optional<Client> clientOptional =
                    clientRepository.findByEmail(email);
            return clientOptional.map(Client::getId).orElse(null);
        }
        return null;
    }

    public Long getCurrentAuthenticatedCompanyId() {
        Object principal =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (principal instanceof UserDetails) {
            String email =
                    ((UserDetails) principal).getUsername();
            return deliveryCompanyService
                    .getCompanyIdByEmail(email);
        }
        return null;
    }
}
