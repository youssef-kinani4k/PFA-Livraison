package com.pfa.livraison.service;

import com.pfa.livraison.dto.DeliveryPersonnelDailyRouteResponse;
import com.pfa.livraison.dto.DeliveryRouteEntryStatusUpdate;
import com.pfa.livraison.model.DailyDeliveryDetails;
import com.pfa.livraison.model.Delivery;
import com.pfa.livraison.model.DeliveryCompanyDailyStats;
import com.pfa.livraison.model.DeliveryRouteEntry;
import com.pfa.livraison.model.DeliveryStatus;
import com.pfa.livraison.repository.DeliveryCompanyDailyStatsRepository;
import com.pfa.livraison.repository.DeliveryRepository;
import com.pfa.livraison.repository.DeliveryPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryPersonnelDashboardService {

    private final DeliveryCompanyDailyStatsRepository dailyStatsRepository;
    private final DeliveryRepository deliveryRepository;
    private final DeliveryPersonnelRepository deliveryPersonnelRepository;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ISO_LOCAL_DATE;

    public DeliveryPersonnelDailyRouteResponse getPersonnelDailyRoutes(
            Long companyId,
            Long personnelId,
            LocalDate date) {

        String companyIdStr = String.valueOf(companyId);
        String dateStr = date.format(DATE_FORMATTER);

        Optional<DeliveryCompanyDailyStats> dailyStatsOptional =
                dailyStatsRepository.findById(companyIdStr);

        if (dailyStatsOptional.isPresent()) {
            DeliveryCompanyDailyStats dailyStats =
                    dailyStatsOptional.get();
            Map<String, DailyDeliveryDetails> allDailyData =
                    dailyStats.getDailyData();

            if (allDailyData != null &&
                    allDailyData.containsKey(dateStr)) {

                DailyDeliveryDetails dailyDetails =
                        allDailyData.get(dateStr);
                Map<String, List<DeliveryRouteEntry>> personnelRoutes =
                        dailyDetails.getTrajet();

                if (personnelRoutes != null &&
                        personnelRoutes.containsKey(
                                String.valueOf(personnelId))) {

                    List<DeliveryRouteEntry> specificPersonnelRoutes =
                            personnelRoutes.get(
                                    String.valueOf(personnelId));

                    return DeliveryPersonnelDailyRouteResponse.builder()
                            .personnelId(
                                    String.valueOf(personnelId))
                            .date(date)
                            .routes(
                                    Collections.singletonMap(
                                            String.valueOf(personnelId),
                                            specificPersonnelRoutes))
                            .build();
                }
            }
        }
        return null;
    }

    @Transactional
    public boolean updateDeliveryRouteEntryStatus(
            DeliveryRouteEntryStatusUpdate updateRequest) {

        Optional<Delivery> deliveryOptional =
                deliveryRepository.findById(
                        updateRequest.getDeliveryId());

        if (deliveryOptional.isEmpty()) {
            throw new IllegalArgumentException(
                    "Delivery not found for ID: " +
                            updateRequest.getDeliveryId());
        }

        Delivery delivery = deliveryOptional.get();

        if ("recuperation".equalsIgnoreCase(
                updateRequest.getType())) {

            delivery.setStatus(DeliveryStatus.RECUPERE);

        } else if ("livraison".equalsIgnoreCase(
                updateRequest.getType())) {

            delivery.setStatus(DeliveryStatus.LIVRE);

        } else {
            throw new IllegalArgumentException(
                    "Invalid route entry type: " +
                            updateRequest.getType());
        }

        deliveryRepository.save(delivery);

        return true;
    }

    public List<LocalDate> getPersonnelAvailableRouteDates(
            Long companyId,
            Long personnelId) {

        String companyIdStr = String.valueOf(companyId);
        Optional<DeliveryCompanyDailyStats> dailyStatsOptional =
                dailyStatsRepository.findById(companyIdStr);

        if (dailyStatsOptional.isPresent()) {
            DeliveryCompanyDailyStats dailyStats =
                    dailyStatsOptional.get();

            return dailyStats.getDailyData()
                    .entrySet()
                    .stream()
                    .filter(entry ->
                            entry.getValue().getTrajet() != null &&
                            entry.getValue().getTrajet()
                                    .containsKey(
                                            String.valueOf(personnelId)))
                    .map(entry ->
                            LocalDate.parse(
                                    entry.getKey(),
                                    DATE_FORMATTER))
                    .sorted()
                    .collect(Collectors.toList());
        }

        return Collections.emptyList();
    }
}
