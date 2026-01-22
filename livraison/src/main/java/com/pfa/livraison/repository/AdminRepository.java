package com.pfa.livraison.repository;

import com.pfa.livraison.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);
}