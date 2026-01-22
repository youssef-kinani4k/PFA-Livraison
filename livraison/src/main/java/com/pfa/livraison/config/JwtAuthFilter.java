package com.pfa.livraison.config;

import com.pfa.livraison.service.AdminUserDetailsService;
import com.pfa.livraison.service.ClientUserDetailsService;
import com.pfa.livraison.service.DeliveryCompanyUserDetailsService;
import com.pfa.livraison.service.DeliveryPersonnelUserDetailsService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AdminUserDetailsService adminUserDetailsService;
    private final ClientUserDetailsService clientUserDetailsService;
    private final DeliveryCompanyUserDetailsService deliveryCompanyUserDetailsService;
    private final DeliveryPersonnelUserDetailsService deliveryPersonnelUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        final String rawUserRole;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        rawUserRole = jwtService.extractClaim(jwt, claims -> claims.get("role", String.class));

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = null;
            UserDetailsService selectedUserDetailsService = null;

            if (rawUserRole != null) {
                switch (rawUserRole) {
                    case "ADMIN":
                        selectedUserDetailsService = adminUserDetailsService;
                        break;
                    case "CLIENT":
                        selectedUserDetailsService = clientUserDetailsService;
                        break;
                    case "COMPANY":
                        selectedUserDetailsService = deliveryCompanyUserDetailsService;
                        break;
                    case "DELIVERY_PERSONNEL":
                        selectedUserDetailsService = deliveryPersonnelUserDetailsService;
                        break;
                    default:
                        logger.warn("Unknown or unsupported raw user role found in JWT: " + rawUserRole + " for user: " + userEmail);
                        break;
                }
            }

            if (selectedUserDetailsService != null) {
                try {
                    userDetails = selectedUserDetailsService.loadUserByUsername(userEmail);
                } catch (UsernameNotFoundException e) {
                    logger.warn("User '" + userEmail + "' not found by " + rawUserRole + " UserDetailsService.", e);
                }
            } else {
                logger.warn("No UserDetailsService could be selected for user: " + userEmail + " with raw role: " + rawUserRole);
            }

            if (userDetails != null && jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}