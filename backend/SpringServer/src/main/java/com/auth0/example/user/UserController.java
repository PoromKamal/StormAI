package com.auth0.example.user;


import com.auth0.example.whiteboard.Whiteboard;
import com.auth0.example.whiteboard.WhiteboardRequest;
import com.auth0.example.whiteboard.WhiteboardService;
import net.minidev.json.parser.JSONParser;
import net.minidev.json.parser.ParseException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public record UserController(UserService userService, WhiteboardService whiteboardService){
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
  public RedirectView upgradeUser(HttpServletResponse response) {
    // Extract the email from the metadata
    User user = userService.getMe();
    user = userService.upgradeUser(user);
    RedirectView redirectView = new RedirectView();
    redirectView.setUrl("http://localhost:3000");
    return redirectView;
  }

  @PostMapping("/saveWhiteboard")
  public String saveWhiteboardForUser(HttpServletResponse response, @RequestBody String body) throws ParseException {
    JSONParser parser = new JSONParser();
    Map<String, String> bodyMap = (Map<String, String>) parser.parse(body);
    String whiteboardId = bodyMap.get("whiteboardId");
    String whiteboardName = bodyMap.get("whiteboardName");
    boolean saved = whiteboardService.saveWhiteboardForUser(whiteboardId, whiteboardName);
    if(!saved){
      response.setStatus(500);
      return "Error saving whiteboard";
    }
    return "Saved Successfully";
  }

  @GetMapping("/getWhiteboards")
  public List<Whiteboard> getWhiteboardsForUser(HttpServletResponse response){
    return whiteboardService.getWhiteboardsForUser();
  }
}
