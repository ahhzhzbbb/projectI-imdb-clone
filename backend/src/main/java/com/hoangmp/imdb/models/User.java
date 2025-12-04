package com.hoangmp.imdb.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = true)
    private String password;
    private LocalDate createAt;
    private String status;
    private String name;
    private Boolean gender;
    private LocalDate birth;

    @Column(nullable = false, unique = true)
    private String email;
    private String phoneNumber;
}
