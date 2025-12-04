package com.hoangmp.imdb.payload.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}