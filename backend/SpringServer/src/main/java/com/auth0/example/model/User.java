package com.auth0.example.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
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
  private String email;
  private String username; //Not unique, will init as their given name
}
