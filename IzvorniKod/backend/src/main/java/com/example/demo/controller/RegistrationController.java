package com.example.demo.controller;

import com.example.demo.service.korisnik.KorisnikService;
import com.example.demo.users.Korisnik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = "/register")
public class RegistrationController {
    @Autowired
    private KorisnikService korisnikService;


    @PostMapping
    public String register(@RequestBody Korisnik korisnik) {
        korisnikService.addKorisnik(korisnik);
        return "Uspjesna registracija!";
    }

}
