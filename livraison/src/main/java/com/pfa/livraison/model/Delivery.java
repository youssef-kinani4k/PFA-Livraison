package com.pfa.livraison.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private DeliveryCompany company;

    @Column(name = "package_weight", nullable = false, precision = 10, scale = 2)
    private BigDecimal packageWeight;

    @Column(name = "pickup_location_latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal pickupLocationLatitude;

    @Column(name = "pickup_location_longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal pickupLocationLongitude;

    @Column(name = "delivery_location_latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal deliveryLocationLatitude;

    @Column(name = "delivery_location_longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal deliveryLocationLongitude;

    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    @Column(name = "delivery_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private DeliveryStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
