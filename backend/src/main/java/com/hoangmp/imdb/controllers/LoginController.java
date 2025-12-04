package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.request.LoginRequest;
import com.hoangmp.imdb.payload.response.LoginResponse;
import com.hoangmp.imdb.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @PostMapping("/public/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request)
    {
        return loginService.checkUserLogin(request);
    }
}