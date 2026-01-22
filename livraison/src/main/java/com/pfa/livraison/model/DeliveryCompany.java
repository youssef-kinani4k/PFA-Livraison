package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "delivery_companies")
public class DeliveryCompany implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String patentNumber;
    private String companyPaperPath;

    private String email;
    private String phone;
    private String password;

    private boolean approved;
    private boolean blocked;

    @Column(name = "prix_de_base", precision = 10, scale = 2)
    private BigDecimal prixDeBase;

    @Column(name = "prix_par_kilogramme", precision = 10, scale = 2)
    private BigDecimal prixParKilogramme;

    private BigDecimal depotLatitude;
    private BigDecimal depotLongitude;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Delivery> deliveries;

    @OneToMany(mappedBy = "deliveryCompany", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<DeliveryPersonnel> personnel;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !blocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return approved && !blocked;
    }
}
