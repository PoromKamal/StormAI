package com.auth0.example.controller;


import com.auth0.example.model.User;
import com.auth0.example.model.UserRequest;
import com.auth0.example.service.UserService;
import com.auth0.example.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public record UserController(UserService userService){
  @GetMapping("/getMe")
  public User getMe(HttpServletResponse response){
    User user = userService.getMe();
    if(user == null){
      response.setStatus(401);
      return null;
    }
    return user;
  }


  @GetMapping("/upgradeUser")
  public User upgradeUser(HttpServletResponse response) {
    // Extract the email from the metadata
    User user = userService.getMe();
            user = userService.upgradeUser(user);
    return user;
  }

  @GetMapping("/test")
  public String hello(){
    return "Hello World";
  }
}
