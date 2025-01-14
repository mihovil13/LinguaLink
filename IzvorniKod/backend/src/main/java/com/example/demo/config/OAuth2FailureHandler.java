package com.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        // Redirect the user to the login page with an error query parameter
        String redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:3000/login")
                .queryParam("error", "user_exists") // Add the error parameter to the URL
                .toUriString();

        response.sendRedirect(redirectUrl); // Send the redirect to the frontend
    }
}
