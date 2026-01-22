package com.pfa.livraison.service;

import com.pfa.livraison.repository.DeliveryCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeliveryCompanyUserDetailsService implements UserDetailsService {

    private final DeliveryCompanyRepository deliveryCompanyRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return deliveryCompanyRepository.findByEmail(email)
                .map(company -> (UserDetails) company)
                .orElseThrow(() -> new UsernameNotFoundException("Société de livraison non trouvée avec l'email: " + email));
    }
}