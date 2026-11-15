package com.gocart.backend.repository;

import com.gocart.backend.model.Store;
import com.gocart.backend.model.StoreStatus;
import com.gocart.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    Optional<Store> findByUsername(String username);
    List<Store> findByStatus(StoreStatus status);
    Optional<Store> findByOwner(User owner);
    boolean existsByUsername(String username);
}

