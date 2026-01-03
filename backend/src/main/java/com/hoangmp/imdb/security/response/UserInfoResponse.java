package com.hoangmp.imdb.security.response;

import com.hoangmp.imdb.models.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {
    private Long userId;
    private String jwtToken;
    private String username;
    private List<String> roles;

    // Profile fields
    private String phoneNumber;

    public UserInfoResponse(Long id, String username, String name, List<String> roles) {
        this.userId = id;
        this.username = username;
        this.roles = roles;
    }

    public UserInfoResponse(Long id, String username, List<String> roles, String phoneNumber) {
        this.userId = id;
        this.username = username;
        this.roles = roles;
        this.phoneNumber = phoneNumber;
    }
}