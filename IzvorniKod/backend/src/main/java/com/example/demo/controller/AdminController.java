package com.example.demo.controller;

import com.example.demo.model.Korisnik;
import com.example.demo.service.KorisnikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private KorisnikService korisnikService;

    @GetMapping("/korisnici")
    public ResponseEntity<List<Korisnik>> getAllUsersExceptAdmins() {
        List<Korisnik> korisnici = korisnikService.getAllUsersExceptAdmins();
        return ResponseEntity.ok(korisnici);
    }
    @DeleteMapping("/delete_korisnik/{id}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long id) {
        boolean isDeleted = korisnikService.deleteUserById(id);
        if (isDeleted) {
            return ResponseEntity.ok("Korisnik uspješno izbrisan");
        } else {
            return ResponseEntity.badRequest().body("Korisnik s ID-em " + id + " nije pronađen");
        }
    }
}