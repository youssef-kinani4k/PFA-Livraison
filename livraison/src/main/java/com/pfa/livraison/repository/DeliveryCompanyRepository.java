package com.pfa.livraison.repository;

import com.pfa.livraison.model.DeliveryCompany;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeliveryCompanyRepository extends JpaRepository<DeliveryCompany, Long> {

    Optional<DeliveryCompany> findByEmail(String email);
    
    List<DeliveryCompany> findByApprovedTrueAndBlockedFalse();
    List<DeliveryCompany> findByApprovedTrue();
    List<DeliveryCompany> findByApprovedFalse();
    List<DeliveryCompany> findByBlockedFalse();
    List<DeliveryCompany> findByBlockedTrue();
    boolean existsByEmail(String email);

    boolean existsByPatentNumber(String patentNumber);
    List<DeliveryCompany> findByApproved(boolean approved);
    List<DeliveryCompany> findByBlocked(boolean blocked);
}