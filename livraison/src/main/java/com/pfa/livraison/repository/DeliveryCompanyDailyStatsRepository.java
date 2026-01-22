package com.pfa.livraison.repository;

import com.pfa.livraison.model.DeliveryCompanyDailyStats;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryCompanyDailyStatsRepository extends MongoRepository<DeliveryCompanyDailyStats, String> {

    @Query("{ 'dailyData.?0.livraison': { $exists: true, $ne: [] } }")
    List<DeliveryCompanyDailyStats> findByDailyDataDateExistsAndHasDeliveries(String date);
}