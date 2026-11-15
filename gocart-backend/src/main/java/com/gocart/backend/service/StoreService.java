package com.gocart.backend.service;

import com.gocart.backend.model.Role;
import com.gocart.backend.model.Store;
import com.gocart.backend.model.StoreStatus;
import com.gocart.backend.model.User;
import com.gocart.backend.repository.StoreRepository;
import com.gocart.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Store> getAllApprovedStores() {
        return storeRepository.findByStatus(StoreStatus.APPROVED);
    }

    public List<Store> getAllPendingStores() {
        return storeRepository.findByStatus(StoreStatus.PENDING);
    }

    public Optional<Store> getStoreByUsername(String username) {
        return storeRepository.findByUsername(username);
    }

    public Optional<Store> getStoreByOwner(User owner) {
        return storeRepository.findByOwner(owner);
    }

    @Transactional
    public Store createStore(String name, String username, String description, String logo, String email, String contact, User owner) {
        Store store = new Store(name, username, description, logo, email, contact, owner);
        store.setStatus(StoreStatus.PENDING);

        // Update user role to ROLE_VENDOR
        owner.setRole(Role.ROLE_VENDOR);
        userRepository.save(owner);

        return storeRepository.save(store);
    }

    @Transactional
    public Store updateStoreStatus(Long storeId, StoreStatus status) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        store.setStatus(status);
        return storeRepository.save(store);
    }
}

