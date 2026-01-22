package com.pfa.livraison.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pfa.livraison.dto.DriverRequest;
import com.pfa.livraison.dto.PickupDeliveryRequest;
import com.pfa.livraison.dto.RouteStop;
import com.pfa.livraison.dto.RoutingRequest;
import com.pfa.livraison.model.DailyDeliveryDetails;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.model.DeliveryCompanyDailyStats;
import com.pfa.livraison.model.DeliveryPersonnel;
import com.pfa.livraison.model.DeliveryRouteEntry;
import com.pfa.livraison.repository.DeliveryCompanyDailyStatsRepository;
import com.pfa.livraison.repository.DeliveryPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OptimizationService {

    private static final Logger logger =
            LoggerFactory.getLogger(OptimizationService.class);

    private final DeliveryCompanyDailyStatsRepository dailyStatsRepository;
    private final DeliveryCompanyService deliveryCompanyService;
    private final DeliveryPersonnelRepository deliveryPersonnelRepository;
    private final RoutingService routingService;
    private final ObjectMapper objectMapper;

    @Scheduled(cron = "0 0 0 * * ?")
    public void dailyRouteOptimization() {
        LocalDate optimizationDate = LocalDate.now();
        String dateKey =
                optimizationDate.format(DateTimeFormatter.ISO_LOCAL_DATE);

        logger.info(
                "Starting daily route optimization for date: {}",
                dateKey);

        List<DeliveryCompanyDailyStats> companiesWithDeliveries =
                dailyStatsRepository
                        .findByDailyDataDateExistsAndHasDeliveries(
                                dateKey);

        if (companiesWithDeliveries.isEmpty()) {
            logger.info(
                    "No companies found with deliveries for date {}.",
                    dateKey);
            return;
        }

        for (DeliveryCompanyDailyStats companyStats :
                companiesWithDeliveries) {

            String companyMongoId =
                    companyStats.getCompanyId();

            logger.info(
                    "Optimizing routes for company ID: {} on date: {}",
                    companyMongoId,
                    dateKey);

            try {
                Long companySqlId =
                        Long.valueOf(companyMongoId);

                DeliveryCompany company =
                        deliveryCompanyService
                                .getCompanyById(companySqlId);

                List<BigDecimal> depotLocation =
                        List.of(
                                company.getDepotLongitude(),
                                company.getDepotLatitude());

                List<DeliveryPersonnel> personnel =
                        deliveryPersonnelRepository
                                .findByDeliveryCompany_Id(companySqlId);

                if (personnel.isEmpty()) {
                    logger.warn(
                            "No delivery personnel found for company ID: {}",
                            companyMongoId);
                    continue;
                }

                List<DriverRequest> driverRequests =
                        personnel.stream()
                                .map(p ->
                                        new DriverRequest(
                                                String.valueOf(p.getId()),
                                                p.getCapacityKg()))
                                .collect(Collectors.toList());

                DailyDeliveryDetails dailyDetails =
                        companyStats
                                .getDailyData()
                                .get(dateKey);

                if (dailyDetails == null ||
                        dailyDetails.getLivraison().isEmpty()) {
                    logger.warn(
                            "No deliveries found for company ID: {} on date {}",
                            companyMongoId,
                            dateKey);
                    continue;
                }

                List<PickupDeliveryRequest> pickupDeliveryRequests =
                        dailyDetails.getLivraison()
                                .stream()
                                .map(entry ->
                                        new PickupDeliveryRequest(
                                                entry.getIdLivraison(),
                                                entry.getLocalisationRecuperation(),
                                                entry.getLocalisationLivraison(),
                                                entry.getTaille()))
                                .collect(Collectors.toList());

                RoutingRequest routingRequest =
                        new RoutingRequest(
                                pickupDeliveryRequests,
                                driverRequests,
                                depotLocation);

                String optimizedRoutesJson =
                        routingService.optimizeRoutes(routingRequest);

                logger.info(
                        "Optimization result for company {}: {}",
                        companyMongoId,
                        optimizedRoutesJson);

                if (!optimizedRoutesJson.contains("{\"error\":")) {

                    Map<String, List<DeliveryRouteEntry>> optimizedTrajet =
                            parseOptimizedRoutesJson(
                                    optimizedRoutesJson);

                    dailyDetails.setTrajet(optimizedTrajet);
                    companyStats.getDailyData()
                            .put(dateKey, dailyDetails);

                    dailyStatsRepository.save(companyStats);

                    logger.info(
                            "Successfully updated MongoDB for company {} on date {}",
                            companyMongoId,
                            dateKey);
                } else {
                    logger.error(
                            "Failed to optimize routes for company {}",
                            companyMongoId);
                }

            } catch (Exception e) {
                logger.error(
                        "Error optimizing routes for company ID: {} on date {}",
                        companyMongoId,
                        dateKey,
                        e);
            }
        }

        logger.info(
                "Daily route optimization completed for date: {}",
                dateKey);
    }

    private Map<String, List<DeliveryRouteEntry>>
    parseOptimizedRoutesJson(String json)
            throws JsonProcessingException {

        TypeReference<Map<String, List<RouteStop>>> typeRef =
                new TypeReference<>() {};

        Map<String, List<RouteStop>> parsedRoutes =
                objectMapper.readValue(json, typeRef);

        Map<String, List<DeliveryRouteEntry>> finalTrajetMap =
                new HashMap<>();

        for (Map.Entry<String, List<RouteStop>> entry :
                parsedRoutes.entrySet()) {

            String driverId = entry.getKey();

            List<DeliveryRouteEntry> deliveryRouteEntries =
                    entry.getValue()
                            .stream()
                            .map(routeStop ->
                                    DeliveryRouteEntry.builder()
                                            .idLivraison(
                                                    routeStop.getId_livraison())
                                            .type(routeStop.getType())
                                            .localisation(
                                                    routeStop.getCoordinates())
                                            .taille(
                                                    routeStop.getDemand())
                                            .build())
                            .collect(Collectors.toList());

            finalTrajetMap.put(
                    driverId,
                    deliveryRouteEntries);
        }

        return finalTrajetMap;
    }
}
