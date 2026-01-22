package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeliveryEntry {

    @JsonProperty("id_livraison")
    private String idLivraison;

    @JsonProperty("localisation_recuperation")
    private List<BigDecimal> localisationRecuperation;

    @JsonProperty("localisation_livraison")
    private List<BigDecimal> localisationLivraison;

    private BigDecimal taille;

    public DeliveryEntry() {
    }

    public DeliveryEntry(
            String idLivraison,
            List<BigDecimal> localisationRecuperation,
            List<BigDecimal> localisationLivraison,
            BigDecimal taille) {
        this.idLivraison = idLivraison;
        this.localisationRecuperation = localisationRecuperation;
        this.localisationLivraison = localisationLivraison;
        this.taille = taille;
    }

    public String getIdLivraison() {
        return idLivraison;
    }

    public void setIdLivraison(String idLivraison) {
        this.idLivraison = idLivraison;
    }

    public List<BigDecimal> getLocalisationRecuperation() {
        return localisationRecuperation;
    }

    public void setLocalisationRecuperation(
            List<BigDecimal> localisationRecuperation) {
        this.localisationRecuperation = localisationRecuperation;
    }

    public List<BigDecimal> getLocalisationLivraison() {
        return localisationLivraison;
    }

    public void setLocalisationLivraison(
            List<BigDecimal> localisationLivraison) {
        this.localisationLivraison = localisationLivraison;
    }

    public BigDecimal getTaille() {
        return taille;
    }

    public void setTaille(BigDecimal taille) {
        this.taille = taille;
    }

    @Override
    public String toString() {
        return "DeliveryEntry{" +
                "idLivraison='" + idLivraison + '\'' +
                ", localisationRecuperation=" + localisationRecuperation +
                ", localisationLivraison=" + localisationLivraison +
                ", taille=" + taille +
                '}';
    }
}
