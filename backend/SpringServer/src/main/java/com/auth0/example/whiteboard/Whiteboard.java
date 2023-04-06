package com.auth0.example.whiteboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "Whiteboards")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Whiteboard {
  @Id
  @SequenceGenerator(
      name="user_sequence",
      sequenceName = "user_sequence"
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "user_sequence"
  )
  private Long id;
  private String whiteboardId; //ID of the whiteboard
  private String userId; //User ID of the user who saved the whiteboard
  private String roomName;
}
