package com.pfa.livraison.dto; 
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CompanyRegisterRequest {
    private String companyName;
    private String patentNumber;
    private String email; 
    private String phone;
    private String password;
    private MultipartFile companyPaper;
}