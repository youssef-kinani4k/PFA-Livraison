package com.pfa.livraison.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.ortools.Loader;
import com.google.ortools.constraintsolver.Assignment;
import com.google.ortools.constraintsolver.FirstSolutionStrategy;
import com.google.ortools.constraintsolver.LocalSearchMetaheuristic;
import com.google.ortools.constraintsolver.RoutingIndexManager;
import com.google.ortools.constraintsolver.RoutingModel;
import com.google.ortools.constraintsolver.RoutingSearchParameters;
import com.google.ortools.constraintsolver.main;
import com.google.protobuf.Duration;
import com.pfa.livraison.dto.PickupDeliveryRequest;
import com.pfa.livraison.dto.RouteStop;
import com.pfa.livraison.dto.RoutingRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RoutingService {

    private final OpenRouteService openRouteService;
    private final ObjectMapper objectMapper;

    private static final int DEPOT_INDEX = 0;

    public RoutingService(OpenRouteService openRouteService, ObjectMapper objectMapper) {
        this.openRouteService = openRouteService;
        this.objectMapper = objectMapper;
        Loader.loadNativeLibraries();
    }

    public String optimizeRoutes(RoutingRequest request) {
        try {
            if (request.getDepotLocation() == null || request.getDepotLocation().size() != 2) {
                return "{\"error\": \"Le lieu du dépôt (depotLocation) est manquant ou invalide dans la requête.\"}";
            }

            BigDecimal depotLatInput = request.getDepotLocation().get(1);
            BigDecimal depotLonInput = request.getDepotLocation().get(0);
            BigDecimal[] depotLocation = {depotLonInput, depotLatInput};

            List<BigDecimal[]> allLocations = new ArrayList<>();
            Map<Integer, String> indexToDeliveryIdMap = new HashMap<>();
            Map<Integer, String> indexToTypeMap = new HashMap<>();

            allLocations.add(depotLocation);
            indexToDeliveryIdMap.put(DEPOT_INDEX, "depot");
            indexToTypeMap.put(DEPOT_INDEX, "depot");

            List<Long> tempDemands = new ArrayList<>();
            tempDemands.add(0L);

            List<Long> tempPickupIndices = new ArrayList<>();
            List<Long> tempDeliveryIndices = new ArrayList<>();

            AtomicInteger currentLocIndex = new AtomicInteger(DEPOT_INDEX + 1);

            for (PickupDeliveryRequest pdRequest : request.getDeliveries()) {
                int pickupIndex = currentLocIndex.getAndIncrement();
                BigDecimal pickupLatInput = pdRequest.getLocalisation_recuperation().get(0);
                BigDecimal pickupLonInput = pdRequest.getLocalisation_recuperation().get(1);
                allLocations.add(new BigDecimal[]{pickupLonInput, pickupLatInput});
                tempDemands.add(pdRequest.getTaille().longValue());
                tempPickupIndices.add((long) pickupIndex);
                indexToDeliveryIdMap.put(pickupIndex, pdRequest.getId_livraison());
                indexToTypeMap.put(pickupIndex, "recuperation");

                int deliveryIndex = currentLocIndex.getAndIncrement();
                BigDecimal deliveryLatInput = pdRequest.getLocalisation_livraison().get(0);
                BigDecimal deliveryLonInput = pdRequest.getLocalisation_livraison().get(1);
                allLocations.add(new BigDecimal[]{deliveryLonInput, deliveryLatInput});
                tempDemands.add(-pdRequest.getTaille().longValue());
                tempDeliveryIndices.add((long) deliveryIndex);
                indexToDeliveryIdMap.put(deliveryIndex, pdRequest.getId_livraison());
                indexToTypeMap.put(deliveryIndex, "livraison");
            }

            long[] demands = tempDemands.stream().mapToLong(Long::longValue).toArray();
            long[] finalPickupIndices = tempPickupIndices.stream().mapToLong(Long::longValue).toArray();
            long[] finalDeliveryIndices = tempDeliveryIndices.stream().mapToLong(Long::longValue).toArray();

            long[][] distanceMatrix = openRouteService.getDistanceMatrix(allLocations);

            long[] vehicleCapacities = request.getDrivers().stream()
                    .mapToLong(driver -> (long) driver.getCapacite())
                    .toArray();

            Map<Integer, String> driverIdMap = new HashMap<>();
            for (int i = 0; i < request.getDrivers().size(); i++) {
                driverIdMap.put(i, request.getDrivers().get(i).getId_livreur());
            }

            RoutingIndexManager manager = new RoutingIndexManager(
                    allLocations.size(),
                    request.getDrivers().size(),
                    DEPOT_INDEX
            );

            RoutingModel routing = new RoutingModel(manager);

            int transitCallbackIndex = routing.registerTransitCallback(
                    (long fromIndex, long toIndex) -> {
                        int fromNode = manager.indexToNode(fromIndex);
                        int toNode = manager.indexToNode(toIndex);
                        return distanceMatrix[fromNode][toNode];
                    });

            routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);

            int demandCallbackIndex = routing.registerUnaryTransitCallback(
                    (long fromIndex) -> {
                        int fromNode = manager.indexToNode(fromIndex);
                        return fromNode < demands.length ? demands[fromNode] : 0L;
                    });

            routing.addDimensionWithVehicleCapacity(
                    demandCallbackIndex,
                    0,
                    vehicleCapacities,
                    true,
                    "Capacity"
            );

            for (int i = 0; i < finalPickupIndices.length; i++) {
                long pickupNode = manager.nodeToIndex((int) finalPickupIndices[i]);
                long deliveryNode = manager.nodeToIndex((int) finalDeliveryIndices[i]);

                routing.addPickupAndDelivery(pickupNode, deliveryNode);

                routing.solver().addConstraint(
                        routing.solver().makeLessOrEqual(
                                routing.getDimensionOrDie("Capacity").cumulVar(pickupNode),
                                routing.getDimensionOrDie("Capacity").cumulVar(deliveryNode)
                        )
                );
            }

            RoutingSearchParameters searchParameters =
                    main.defaultRoutingSearchParameters()
                            .toBuilder()
                            .setFirstSolutionStrategy(
                                    FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
                            .setLocalSearchMetaheuristic(
                                    LocalSearchMetaheuristic.Value.GUIDED_LOCAL_SEARCH)
                            .setTimeLimit(
                                    Duration.newBuilder().setSeconds(10).build())
                            .build();

            Assignment solution = routing.solveWithParameters(searchParameters);

            if (solution == null) {
                return "{\"error\": \"Aucune solution viable trouvée qui respecte les contraintes.\"}";
            }

            Map<String, List<RouteStop>> finalOutput = new HashMap<>();

            for (int vehicleId = 0; vehicleId < request.getDrivers().size(); ++vehicleId) {
                String driverId = driverIdMap.get(vehicleId);
                List<RouteStop> driverRoute = new ArrayList<>();

                long index = routing.start(vehicleId);
                long routeTime = 0;

                while (!routing.isEnd(index)) {
                    int nodeIndex = manager.indexToNode(index);

                    if (nodeIndex != DEPOT_INDEX) {
                        BigDecimal lon = allLocations.get(nodeIndex)[0];
                        BigDecimal lat = allLocations.get(nodeIndex)[1];
                        driverRoute.add(new RouteStop(
                                indexToDeliveryIdMap.get(nodeIndex),
                                indexToTypeMap.get(nodeIndex),
                                List.of(lat, lon),
                                demands[nodeIndex]
                        ));
                    }

                    long nextIndex = solution.value(routing.nextVar(index));
                    int nextNodeIndex = manager.indexToNode(nextIndex);

                    if (nodeIndex != nextNodeIndex) {
                        routeTime += distanceMatrix[nodeIndex][nextNodeIndex];
                    }

                    index = nextIndex;
                }

                finalOutput.put(driverId, driverRoute);

                System.out.printf(
                        "Driver %s: Total Time: %s%n",
                        driverId,
                        formatDuration(routeTime));
            }

            return objectMapper.writeValueAsString(finalOutput);

        } catch (Exception e) {
            return "{\"error\": \"Erreur lors de l'optimisation des routes: " + e.getMessage() + "\"}";
        }
    }

    private String formatDuration(long totalSeconds) {
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;
        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }
}
