package com.pfa.livraison.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/admin/files")
public class FileServingController {

    private final Path fileStorageLocation =
            Paths.get("uploads").toAbsolutePath().normalize();

    @GetMapping("/company-paper/{fileName:.+}")
    public ResponseEntity<Resource> downloadCompanyPaper(
            @PathVariable String fileName) {

        try {
            Path filePath =
                    this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource =
                    new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = "application/octet-stream";
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(
                                HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" +
                                        resource.getFilename() + "\""
                        )
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
