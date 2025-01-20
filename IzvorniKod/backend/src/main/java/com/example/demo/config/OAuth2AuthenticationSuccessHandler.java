package com.example.demo.config;

import com.example.demo.repository.KorisnikRepository;
import com.example.demo.service.KorisnikServiceJPA;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Autowired
    private JwtService jwtService;
    private final KorisnikRepository repository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        // Generate a JWT token
        UserDetails user = repository.findByEmail(email).orElseThrow();
        String jwt = jwtService.generateToken(user);

        // Redirect to frontend with JWT as a query parameter
        String redirectUrl = "https://lingualink-frontend-v1.onrender.com/profile?token=" + jwt;
        response.sendRedirect(redirectUrl);
    }
}

