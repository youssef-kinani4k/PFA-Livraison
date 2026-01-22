package com.pfa.livraison.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final DeliveryCompanyUserDetailsService deliveryCompanyUserDetailsService;
    private final ClientUserDetailsService clientUserDetailsService;
    private final DeliveryPersonnelUserDetailsService deliveryPersonnelUserDetailsService;
    private final AdminUserDetailsService adminUserDetailsService;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        try {
            return deliveryCompanyUserDetailsService.loadUserByUsername(email);
        } catch (UsernameNotFoundException e) {
            try {
                return clientUserDetailsService.loadUserByUsername(email);
            } catch (UsernameNotFoundException ex) {
                try {
                    return deliveryPersonnelUserDetailsService.loadUserByUsername(email);
                } catch (UsernameNotFoundException exc) {
                    try {
                        return adminUserDetailsService.loadUserByUsername(email);
                    } catch (UsernameNotFoundException finalEx) {
                        throw new UsernameNotFoundException(
                                "Utilisateur non trouvé avec l'email: " + email);
                    }
                }
            }
        }
    }
}
