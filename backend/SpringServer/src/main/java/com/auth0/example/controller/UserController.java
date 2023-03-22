package com.auth0.example.controller;


import com.auth0.example.model.User;
import com.auth0.example.model.UserRequest;
import com.auth0.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
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

  @GetMapping("/test")
  public String hello(){
    return "Hello World";
  }
}
