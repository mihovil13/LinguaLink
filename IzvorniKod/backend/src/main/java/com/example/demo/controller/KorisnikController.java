package com.example.demo.controller;

import com.example.demo.model.Korisnik;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.service.KorisnikService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
//@RequestMapping("/api/korisnici")
@RequestMapping("/moj-profil")
public class KorisnikController {
  /*  private final KorisnikService korisnikService;

    @Autowired
    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody Korisnik korisnik, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Ako postoje greške s login podatcima, prikazujemo ih korisniku
            StringBuilder errorMessage = new StringBuilder();
            bindingResult.getAllErrors().forEach(error -> {
                errorMessage.append(error.getDefaultMessage()).append("\n");
            });
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage.toString());
        }
        System.out.println(korisnik.toString());
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
    }*/

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Pozdrav s mojeg profila!");
    }



}
