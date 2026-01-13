package com.hoangmp.imdb.services;

import com.hoangmp.imdb.security.request.LoginRequest;
import com.hoangmp.imdb.security.request.SignupRequest;
import com.hoangmp.imdb.security.response.AuthenticationResult;
import com.hoangmp.imdb.security.response.MessageResponse;
import com.hoangmp.imdb.security.response.UserInfoResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface AuthService {
    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    UserInfoResponse updateProfile(Authentication authentication, String phoneNumber);

    ResponseCookie logoutUser();
}
