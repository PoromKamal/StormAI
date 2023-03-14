package com.auth0.example.model;

import lombok.*;

import javax.persistence.*;

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
  private String firstName;
  private String lastName;
}
