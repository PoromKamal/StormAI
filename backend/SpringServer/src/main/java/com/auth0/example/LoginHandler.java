package com.auth0.example;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.example.user.UserService;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Map;

public class LoginHandler implements AuthenticationSuccessHandler{

  //Inject UserService into this class

  @Autowired
  private UserService userService;

  @Autowired
  private Environment env;

  public LoginHandler() {
  }

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    String email = getEmail((OAuth2AuthenticationToken) authentication);
    String username = getName((OAuth2AuthenticationToken) authentication);
    userService.registerUser(email, username, 0);
    String redirect_url = env.getProperty("spring.redirect.url");
    response.sendRedirect(redirect_url);
  }

  public String getName(OAuth2AuthenticationToken authentication) {
    //Check if given name is present
    Map<String, Object> attributes = authentication.getPrincipal().getAttributes();
    if(attributes.get("given_name") != null){
      return attributes.get("given_name").toString();
    }

    //If not, check nickname
    if(attributes.get("nickname") != null){
      return attributes.get("nickname").toString();
    }

    //If not, check if name is present
    if(attributes.get("name") != null){
      return attributes.get("name").toString();
    }

    //If not, just use email
    return getEmail(authentication);
  }

  public String getEmail(OAuth2AuthenticationToken authentication) {
    return authentication.getPrincipal().getAttributes().get("email").toString();
  }
}
