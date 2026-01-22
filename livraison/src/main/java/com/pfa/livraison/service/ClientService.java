package com.pfa.livraison.service;

import com.pfa.livraison.model.Client;
import com.pfa.livraison.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client findById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Client not found with ID: " + clientId));
    }

    @Transactional
    public Client updateClientBlockingStatus(Long clientId, boolean blocked) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Client not found with ID: " + clientId));
        client.setBlocked(blocked);
        return clientRepository.save(client);
    }

    public List<Client> getClientsByBlockedStatus(boolean blocked) {
        return clientRepository.findByBlocked(blocked);
    }
}
