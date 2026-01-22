package com.pfa.livraison.dto; 

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DriverRequest {
    private String id_livreur; 
    private double capacite;   
}