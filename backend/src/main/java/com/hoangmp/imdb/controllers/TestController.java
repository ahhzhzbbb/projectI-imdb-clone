package com.hoangmp.imdb.controllers;

import jakarta.annotation.security.PermitAll;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @PermitAll
    @GetMapping("/hello")
    public String hello(Authentication authentication) {
        return authentication.getName();
    }

}
