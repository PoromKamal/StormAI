package com.auth0.example;


import com.auth0.example.model.User;
import com.auth0.example.model.UserRequest;
import com.auth0.example.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public record UserController(UserService userService){
  @PostMapping("/register")
  public void registerUser(@RequestBody UserRequest newUser){
    userService.registerUser(newUser.email(), newUser.username());
  }

  @GetMapping("/test")
  public String hello(){
    return "Hello World";
  }
}
