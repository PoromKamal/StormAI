package com.auth0.example.repository;

import com.auth0.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
  User findByEmail(String email);
};
