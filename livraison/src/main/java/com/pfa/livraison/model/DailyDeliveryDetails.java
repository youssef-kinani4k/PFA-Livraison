package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DailyDeliveryDetails {

    private List<DeliveryEntry> livraison;
    private Map<String, List<DeliveryRouteEntry>> trajet;

    public DailyDeliveryDetails() {
        this.livraison = new ArrayList<>();
        this.trajet = new HashMap<>();
    }

    public List<DeliveryEntry> getLivraison() {
        return livraison;
    }

    public void setLivraison(List<DeliveryEntry> livraison) {
        this.livraison = livraison;
    }

    public Map<String, List<DeliveryRouteEntry>> getTrajet() {
        return trajet;
    }

    public void setTrajet(Map<String, List<DeliveryRouteEntry>> trajet) {
        this.trajet = trajet;
    }

    @Override
    public String toString() {
        return "DailyDeliveryDetails{" +
                "livraison=" + livraison +
                ", trajet=" + trajet +
                '}';
    }
}
