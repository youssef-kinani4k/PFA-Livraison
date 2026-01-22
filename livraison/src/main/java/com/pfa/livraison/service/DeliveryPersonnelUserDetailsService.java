package com.pfa.livraison.service;

import com.pfa.livraison.model.DeliveryPersonnel;
import com.pfa.livraison.repository.DeliveryPersonnelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeliveryPersonnelUserDetailsService implements UserDetailsService {

    private final DeliveryPersonnelRepository deliveryPersonnelRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return deliveryPersonnelRepository.findByEmail(email)
                .map(personnel -> (UserDetails) personnel)
                .orElseThrow(() -> new UsernameNotFoundException("Livreur non trouvé avec l'email: " + email));
    }
}