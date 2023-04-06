package com.auth0.example.whiteboard;

import com.auth0.example.user.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public record WhiteboardService(WhiteboardRepository whiteboardRepository, UserRepository userRepository){
  /**
   * Save whiteboard, with whiteboard Id to the database, with user id of the current user
   */
  public boolean saveWhiteboardForUser(String whiteboardId, String roomName){
    if(whiteboardRepository.findByWhiteboardId(whiteboardId) != null){
      return true;
    }

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication instanceof AnonymousAuthenticationToken || authentication == null){
      return false;
    }
    OAuth2AuthenticationToken accessToken = (OAuth2AuthenticationToken) authentication;
    String email = accessToken.getPrincipal().getAttributes().get("email").toString();
    String userId = userRepository.findByEmail(email).getId().toString();

    Whiteboard whiteboard = Whiteboard.builder()
      .whiteboardId(whiteboardId)
      .userId(userId)
      .roomName(roomName)
      .build();

    whiteboardRepository.save(whiteboard);
    return true;
  }

  public List<Whiteboard> getWhiteboardsForUser(){
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication instanceof AnonymousAuthenticationToken || authentication == null){
      return null;
    }
    OAuth2AuthenticationToken accessToken = (OAuth2AuthenticationToken) authentication;
    String email = accessToken.getPrincipal().getAttributes().get("email").toString();
    String userId = userRepository.findByEmail(email).getId().toString();
    return whiteboardRepository.findByUserId(userId);
  }
}
