package com.hoangmp.imdb.payload.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Data
public class UserDTO {
    private Long userId;
    private int role;
    private LocalDate createAt;
    private String status;
    private String name;
    private boolean gender;
    private String email;

    public UserDTO(Long userId, String name, String email) {
        this.userId = userId;
        this.name = name;
        this.email = email;
    }
}