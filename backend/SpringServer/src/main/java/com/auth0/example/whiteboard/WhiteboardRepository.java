package com.auth0.example.whiteboard;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WhiteboardRepository extends JpaRepository<Whiteboard, Long> {
  /**
   * Find all whiteboards owned by owner ID
   * @param ownerId
   * @return
   */
  List<Whiteboard> findByUserId(String ownerId);
  Whiteboard findByWhiteboardId(String whiteboardId);
}
