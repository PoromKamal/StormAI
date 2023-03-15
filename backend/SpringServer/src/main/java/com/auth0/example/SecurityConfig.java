package com.auth0.example;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableWebSecurity
public class SecurityConfig {

    private final LogoutHandler logoutHandler;

    private final LoginHandler loginHandler;

    public SecurityConfig(LogoutHandler logoutHandler, LoginHandler loginHandler) {
        this.logoutHandler = logoutHandler;
        this.loginHandler = loginHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            // allow all users to access the home pages and the static images directory
            .mvcMatchers("/", "/images/**").permitAll()
            // all other requests must be authenticated
            .anyRequest().authenticated()
            .and().oauth2Login()
            .successHandler(loginHandler)
            .and().logout()
            // handle logout requests at /logout path
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            // customize logout handler to log out of Auth0
            .addLogoutHandler(logoutHandler);
        return http.build();
    }
}
