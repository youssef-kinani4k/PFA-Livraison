package com.pfa.livraison.controller;

import com.pfa.livraison.model.Client;
import com.pfa.livraison.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminClientController {

    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientDetails(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<Client> blockClient(@PathVariable Long id, @RequestParam boolean blocked) {
        return ResponseEntity.ok(clientService.updateClientBlockingStatus(id, blocked));
    }

    @GetMapping("/filter/blocked")
    public ResponseEntity<List<Client>> getBlockedClients(@RequestParam boolean blocked) {
        return ResponseEntity.ok(clientService.getClientsByBlockedStatus(blocked));
    }
}