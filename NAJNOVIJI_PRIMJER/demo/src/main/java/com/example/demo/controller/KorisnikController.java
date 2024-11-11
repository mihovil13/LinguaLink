package com.example.demo.controller;

import com.example.demo.model.Korisnik;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/korisnici")
public class KorisnikController {
    private final KorisnikService korisnikService;

    @Autowired
    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Korisnik korisnik) {
        try {
            korisnikService.register(korisnik);
            return ResponseEntity.status(HttpStatus.CREATED).body("Korisnik uspješno registriran!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Endpoint za prijavu korisnika
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Korisnik korisnik) {
        try {
            korisnikService.login(korisnik);
            return ResponseEntity.ok("Prijava uspješna!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }


}
