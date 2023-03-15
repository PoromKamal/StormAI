package com.auth0.example;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.example.model.User;
import com.auth0.example.repository.UserRepository;
import com.auth0.example.service.UserService;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.List;

public class LoginHandler implements AuthenticationSuccessHandler{

  //Inject UserService into this class

  @Autowired
  private UserService userService;

  public LoginHandler() {
  }

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    String email = getEmail((OAuth2AuthenticationToken) authentication);
    String username = getGivenName((OAuth2AuthenticationToken) authentication);
    userService.registerUser(email, username);
    response.sendRedirect("http://localhost:3000/");
  }

  public String getGivenName(OAuth2AuthenticationToken authentication) {
    return authentication.getPrincipal().getAttributes().get("given_name").toString();
  }

  public String getEmail(OAuth2AuthenticationToken authentication) {
    return authentication.getPrincipal().getAttributes().get("email").toString();
  }

}
