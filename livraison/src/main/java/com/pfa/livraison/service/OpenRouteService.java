package com.pfa.livraison.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;

@Service
public class OpenRouteService {

    private static final Logger logger =
            LoggerFactory.getLogger(OpenRouteService.class);

    @Value("${openrouteservice.api.key}")
    private String orsApiKey;

    private final HttpClient httpClient =
            HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_1_1)
                    .build();

    private final ObjectMapper objectMapper =
            new ObjectMapper();

    public long[][] getDistanceMatrix(
            List<BigDecimal[]> locations) throws Exception {

        DecimalFormat df = new DecimalFormat("#.######");
        df.setDecimalFormatSymbols(
                DecimalFormatSymbols.getInstance(Locale.US));

        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{\"locations\":[");

        for (int i = 0; i < locations.size(); i++) {
            BigDecimal[] loc = locations.get(i);
            jsonBuilder.append(
                    String.format(
                            Locale.US,
                            "[%s,%s]",
                            df.format(loc[0]),
                            df.format(loc[1])));
            if (i < locations.size() - 1) {
                jsonBuilder.append(",");
            }
        }

        jsonBuilder.append("],\"metrics\":[\"duration\"]}");

        String requestBody = jsonBuilder.toString();
        logger.debug("ORS Matrix Request Body: {}", requestBody);

        HttpRequest request =
                HttpRequest.newBuilder()
                        .uri(URI.create(
                                "https://api.openrouteservice.org/v2/matrix/driving-car"))
                        .header("Content-Type", "application/json")
                        .header("Authorization", orsApiKey)
                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                        .build();

        HttpResponse<String> response =
                httpClient.send(
                        request,
                        HttpResponse.BodyHandlers.ofString());

        logger.debug(
                "ORS Matrix Response Status: {}",
                response.statusCode());
        logger.debug(
                "ORS Matrix Response Body: {}",
                response.body());

        if (response.statusCode() != 200) {
            throw new RuntimeException(
                    "Error from OpenRouteService API: " +
                            response.statusCode() +
                            " - " +
                            response.body());
        }

        JsonNode rootNode =
                objectMapper.readTree(response.body());
        JsonNode durationsNode =
                rootNode.path("durations");

        if (durationsNode.isMissingNode()
                || !durationsNode.isArray()) {
            throw new RuntimeException(
                    "Invalid response from OpenRouteService.");
        }

        long[][] matrix =
                new long[locations.size()][locations.size()];

        for (int i = 0; i < locations.size(); i++) {
            JsonNode row = durationsNode.get(i);
            if (row.isMissingNode() || !row.isArray()) {
                throw new RuntimeException(
                        "Invalid response from OpenRouteService.");
            }
            for (int j = 0; j < locations.size(); j++) {
                JsonNode value = row.get(j);
                if (value.isMissingNode()) {
                    matrix[i][j] = 0;
                } else if (!value.isNumber()) {
                    throw new RuntimeException(
                            "Invalid response from OpenRouteService.");
                } else {
                    matrix[i][j] = value.asLong();
                }
            }
        }

        return matrix;
    }
}
