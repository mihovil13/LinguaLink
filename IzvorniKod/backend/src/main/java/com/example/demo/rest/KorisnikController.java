package com.example.demo.rest;

import com.example.demo.service.KorisnikService;
import com.example.demo.users.Korisnik;
import com.example.demo.users.Ucenik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/korisnik")
public class KorisnikController {
    private KorisnikService korisnikService;
    @Autowired
    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }
    @PostMapping
    public void addKorisnik(@RequestBody Korisnik korisnik){
        korisnikService.addKorisnik(korisnik);
    }
}
