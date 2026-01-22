package com.pfa.livraison.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

 @Value("${file.upload-dir}")
 private String uploadDir;

 public String storeFile(MultipartFile file, String subfolder) throws IOException {
     Path uploadPath = Paths.get(uploadDir, subfolder).toAbsolutePath().normalize();
     Files.createDirectories(uploadPath);

     String originalFileName = Objects.requireNonNull(file.getOriginalFilename());
     String fileName = UUID.randomUUID().toString() + "_" + originalFileName.replaceAll("[^a-zA-Z0-9.\\-]", "_");

     Path filePath = uploadPath.resolve(fileName);
     Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

     return Paths.get(subfolder, fileName).toString();
 }

 public Path loadFile(String filePath) {
     return Paths.get(uploadDir).resolve(filePath).normalize();
 }
}