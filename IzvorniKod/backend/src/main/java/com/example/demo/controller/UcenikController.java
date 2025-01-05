package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Ucenik;
import com.example.demo.service.UcenikServiceJPA;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UcenikController {
    @Autowired
    private final JwtService jwtService;

    @Autowired
    private final UcenikServiceJPA ucenikServiceJPA;

    public UcenikController(JwtService jwtService, UcenikServiceJPA ucenikServiceJPA) {
        this.jwtService = jwtService;
        this.ucenikServiceJPA = ucenikServiceJPA;
    }

    @PostMapping
    public ResponseEntity<?> filterData(@RequestHeader(value = "Authorization", required = false) String token, Authentication authentication
    ,@RequestBody Map<String, Object> body) {
        if(token!= null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Ukloni "Bearer " prefix
            String email = jwtService.extractUsername(token);
            Ucenik ucenik = ucenikServiceJPA.getUcenik(email);
            return ucenikServiceJPA.filterData(ucenik,body);
        }


        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autentificiran.");
    }


}
