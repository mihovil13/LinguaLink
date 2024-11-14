package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Korisnik;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.service.KorisnikService;
import com.example.demo.service.KorisnikServiceJPA;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

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

   // @GetMapping
   /* public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Pozdrav s mojeg profila!");
    }*/

    @GetMapping
    public ResponseEntity<Optional<Korisnik>> fetchData(@RequestHeader("Authorization") String token){
        token = token.startsWith("Bearer ") ? token.substring(7) : token;
        String email = jwtService.extractUsername(token);
        System.out.println(email);
        Optional<Korisnik> korisnik  = korisnikServiceJPA.getKorisnik(email);

        if(korisnik != null){
            return ResponseEntity.ok(korisnik);
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
