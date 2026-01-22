package com.pfa.livraison.repository;

import com.pfa.livraison.model.DeliveryPersonnel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryPersonnelRepository extends JpaRepository<DeliveryPersonnel, Long> {

    Optional<DeliveryPersonnel> findByEmail(String email);
    boolean existsByEmail(String email);
    List<DeliveryPersonnel> findByDeliveryCompany_Id(Long companyId);


}