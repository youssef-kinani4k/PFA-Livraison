package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public class DeliveryRouteEntry {

    @JsonProperty("id_livraison")
    private String idLivraison;

    private String type;
    private List<BigDecimal> localisation;
    private double taille;

    public DeliveryRouteEntry() {
    }

    public DeliveryRouteEntry(
            String idLivraison,
            String type,
            List<BigDecimal> localisation,
            double taille) {
        this.idLivraison = idLivraison;
        this.type = type;
        this.localisation = localisation;
        this.taille = taille;
    }

    public String getIdLivraison() {
        return idLivraison;
    }

    public void setIdLivraison(String idLivraison) {
        this.idLivraison = idLivraison;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<BigDecimal> getLocalisation() {
        return localisation;
    }

    public void setLocalisation(List<BigDecimal> localisation) {
        this.localisation = localisation;
    }

    public double getTaille() {
        return taille;
    }

    public void setTaille(double taille) {
        this.taille = taille;
    }

    @Override
    public String toString() {
        return "DeliveryRouteEntry{" +
                "idLivraison='" + idLivraison + '\'' +
                ", type='" + type + '\'' +
                ", localisation=" + localisation +
                ", taille=" + taille +
                '}';
    }
}
