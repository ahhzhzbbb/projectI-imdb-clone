package com.hoangmp.imdb.payload.response;

import com.hoangmp.imdb.payload.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginResponse {
    private boolean isOK;
    private String message;
    private UserDTO userDTO;
}
