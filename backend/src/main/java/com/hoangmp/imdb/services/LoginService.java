package com.hoangmp.imdb.services;

import com.hoangmp.imdb.payload.request.LoginRequest;
import com.hoangmp.imdb.payload.response.LoginResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public interface LoginService {
    ResponseEntity<LoginResponse> checkUserLogin(LoginRequest loginRequest);
}