package com.pfa.livraison;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.pfa.livraison.repository.AdminRepository;
import com.pfa.livraison.service.AdminAuthService;

@SpringBootApplication
@EnableScheduling
public class LivraisonApplication {

	public static void main(String[] args) {
		SpringApplication.run(LivraisonApplication.class, args);
	}
	@Bean
	public CommandLineRunner initAdmin(AdminAuthService adminAuthService, AdminRepository adminRepository) {
	    return args -> {
	        if (adminRepository.count() == 0) {
	            try {
	                adminAuthService.createAdmin("admin@nexway.com", "admin123");
	                System.out.println("Default admin user created successfully!");
	            } catch (RuntimeException e) {
	                System.err.println("Error creating default admin: " + e.getMessage());
	            }
	        }
	    };
	}

}
