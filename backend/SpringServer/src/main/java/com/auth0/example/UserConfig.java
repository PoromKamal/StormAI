package com.auth0.example;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserConfig {
  @Bean
  public LoginHandler loginHandler() {
    return new LoginHandler();
  }
}
