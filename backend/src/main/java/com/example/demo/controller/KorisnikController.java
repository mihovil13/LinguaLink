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

@RequestMapping("/moj-profil")
public class KorisnikController {

    @GetMapping
    public ResponseEntity<String> sayHello(){
        return ResponseEntity.ok("Pozdrav s mojeg profila!");
    }



}
