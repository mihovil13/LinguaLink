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
import java.util.Map;
@RestController
@RequestMapping("/api")
public class ProfilePictureController {
    @Autowired
    private KorisnikService korisnikService;
    @PostMapping("/spremi-sliku")
    public ResponseEntity<?> spremiSliku(@RequestBody Map<String, String> payload) {
        String email = payload.get("email"); // Pretpostavimo da dolazi email korisnika
        String slika = payload.get("profilePicture");
        Korisnik korisnik = korisnikService.getKorisnikByEmail(email);
        if (korisnik == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Korisnik nije pronađen.");
        }
        korisnik.setProfilePicture(slika);
        korisnikService.save(korisnik);
        return ResponseEntity.ok("Slika uspješno spremljena.");
    }
}