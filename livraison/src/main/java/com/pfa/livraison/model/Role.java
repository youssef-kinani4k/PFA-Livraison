package com.pfa.livraison.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.Set;

@RequiredArgsConstructor
public enum Role {
    COMPANY,
    CLIENT,
    DELIVERY_PERSONNEL,
    ADMIN 
    ;

    public Set<SimpleGrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + this.name()));
    }
}