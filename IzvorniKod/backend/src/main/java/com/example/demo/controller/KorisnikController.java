package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Korisnik;
import com.example.demo.service.KorisnikServiceJPA;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/moj-profil")
public class KorisnikController {

    @Autowired
    private final KorisnikServiceJPA korisnikServiceJPA;
    private final JwtService jwtService;

    public KorisnikController(KorisnikServiceJPA korisnikServiceJPA, JwtService jwtService) {
        this.korisnikServiceJPA = korisnikServiceJPA;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> fetchData(@RequestHeader(value = "Authorization", required = false) String token,
                                       Authentication authentication) {

        if (token != null && token.startsWith("Bearer ")) {
            // Ako je korisnik autentificiran putem JWT tokena
            token = token.substring(7); // Ukloni "Bearer " prefix
            String email = jwtService.extractUsername(token);

            Optional<Korisnik> korisnik = korisnikServiceJPA.getKorisnik(email);
            return korisnik.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autentificiran.");
        }
    }
}
