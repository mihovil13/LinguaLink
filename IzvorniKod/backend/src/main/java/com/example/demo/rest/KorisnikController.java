package com.example.demo.rest;

import com.example.demo.service.korisnik.KorisnikService;
import com.example.demo.users.Korisnik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/korisnik")
public class KorisnikController {
    private KorisnikService korisnikService;
    @Autowired
    public KorisnikController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }
    @PostMapping("/addKorisnik")
    public void addKorisnik(@RequestBody Korisnik korisnik){
        System.out.println(korisnik);
        korisnikService.addKorisnik(korisnik);
    }
}
