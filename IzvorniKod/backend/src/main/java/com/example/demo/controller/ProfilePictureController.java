package com.example.demo.controller;

import com.example.demo.model.Korisnik;
import com.example.demo.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Base64;
import java.util.Map;


@RestController
@RequestMapping("/api")
public class ProfilePictureController {

    private final KorisnikService korisnikService;

    public ProfilePictureController(KorisnikService korisnikService) {
        this.korisnikService = korisnikService;
    }

    @PostMapping("/spremi-sliku")
    public ResponseEntity<?> spremiSliku(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String base64Image = payload.get("slika");
        System.out.println("DOSO SI OVDJE");
        System.out.println("OVO JE OG IZDANJE: " + base64Image.substring(0, 40));
        try {
            if (base64Image.startsWith("data:image")) {
                base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
            }
            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            // Pronalaženje korisnika
            Korisnik korisnik = korisnikService.getKorisnikByEmail(email);
            if (korisnik == null) {
                System.out.println("ALOOOOO");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik nije pronađen.");
            }

            // Spremanje slike u korisnika

            korisnik.setSlika(imageBytes);
            System.out.println("OVO JE PROMIJENJENO: " + Arrays.toString(imageBytes).substring(0, 10));
            korisnikService.save(korisnik);

            return ResponseEntity.ok("Slika uspješno spremljena.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Neispravan Base64 format.");
        }
    }
}