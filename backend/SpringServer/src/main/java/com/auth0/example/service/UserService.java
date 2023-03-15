package com.auth0.example.service;


import com.auth0.example.model.User;
import com.auth0.example.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public record UserService(UserRepository userRepository){
  public void registerUser(String email, String username){
    if (userRepository.findByEmail(email) != null) {
      return;
    }

    User user = User.builder()
      .email(email)
      .username(username)
      .build();
    userRepository.save(user);
  }
}
