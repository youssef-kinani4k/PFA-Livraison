package com.pfa.livraison.repository;

import com.pfa.livraison.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {

    List<Delivery> findByClientIdOrderByCreatedAtDesc(Long clientId);

    List<Delivery> findByCompanyIdAndDeliveryDateOrderByCreatedAtDesc(
            Long companyId,
            LocalDate deliveryDate
    );

    List<Delivery> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
}
