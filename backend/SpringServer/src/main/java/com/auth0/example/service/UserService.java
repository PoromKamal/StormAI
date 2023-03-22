package com.auth0.example.service;


import com.auth0.example.model.User;
import com.auth0.example.repository.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
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

  public User getMe(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication instanceof AnonymousAuthenticationToken){
      return null;
    }
    if(authentication == null){
      return null;
    }
    OAuth2AuthenticationToken accessToken = (OAuth2AuthenticationToken) authentication;
    String email = accessToken.getPrincipal().getAttributes().get("email").toString();
    return userRepository.findByEmail(email);
  }
}
