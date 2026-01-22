package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "dailyDeliveries")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeliveryCompanyDailyStats {

    @Id
    private String companyId;

    private Map<String, DailyDeliveryDetails> dailyData;
    private Map<String, DailyDeliveryDetails> trajet;

    public DeliveryCompanyDailyStats() {
    }

    public DeliveryCompanyDailyStats(
            String companyId,
            Map<String, DailyDeliveryDetails> dailyData,
            Map<String, DailyDeliveryDetails> trajet) {
        this.companyId = companyId;
        this.dailyData = dailyData;
        this.trajet = trajet;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public Map<String, DailyDeliveryDetails> getDailyData() {
        return dailyData;
    }

    public void setDailyData(Map<String, DailyDeliveryDetails> dailyData) {
        this.dailyData = dailyData;
    }

    public Map<String, DailyDeliveryDetails> getTrajet() {
        return trajet;
    }

    public void setTrajet(Map<String, DailyDeliveryDetails> trajet) {
        this.trajet = trajet;
    }

    @Override
    public String toString() {
        return "DeliveryCompanyDailyStats{" +
                "companyId='" + companyId + '\'' +
                ", dailyData=" + dailyData +
                ", trajet=" + trajet +
                '}';
    }
}
