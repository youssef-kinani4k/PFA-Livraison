package com.pfa.livraison.service;

import com.pfa.livraison.model.Client;
import com.pfa.livraison.model.DeliveryCompany;
import com.pfa.livraison.repository.ClientRepository;
import com.pfa.livraison.repository.DeliveryCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final DeliveryCompanyRepository deliveryCompanyRepository;
    private final ClientRepository clientRepository;

    public List<DeliveryCompany> getAllDeliveryCompanies() {
        return deliveryCompanyRepository.findAll();
    }

    public DeliveryCompany getDeliveryCompanyById(Long id) {
        return deliveryCompanyRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Delivery Company not found with ID: " + id));
    }

    @Transactional
    public DeliveryCompany blockDeliveryCompany(Long id) {
        DeliveryCompany company = getDeliveryCompanyById(id);
        company.setBlocked(true);
        return deliveryCompanyRepository.save(company);
    }

    @Transactional
    public DeliveryCompany unblockDeliveryCompany(Long id) {
        DeliveryCompany company = getDeliveryCompanyById(id);
        company.setBlocked(false);
        return deliveryCompanyRepository.save(company);
    }

    @Transactional
    public DeliveryCompany approveDeliveryCompany(Long id) {
        DeliveryCompany company = getDeliveryCompanyById(id);
        company.setApproved(true);
        company.setBlocked(false);
        return deliveryCompanyRepository.save(company);
    }

    @Transactional
    public DeliveryCompany rejectDeliveryCompany(Long id) {
        DeliveryCompany company = getDeliveryCompanyById(id);
        company.setApproved(false);
        company.setBlocked(true);
        return deliveryCompanyRepository.save(company);
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Client not found with ID: " + id));
    }

    @Transactional
    public Client blockClient(Long id) {
        Client client = getClientById(id);
        client.setBlocked(true);
        return clientRepository.save(client);
    }

    @Transactional
    public Client unblockClient(Long id) {
        Client client = getClientById(id);
        client.setBlocked(false);
        return clientRepository.save(client);
    }
}
