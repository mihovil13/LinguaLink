package com.example.demo.service;

import com.example.demo.model.Korisnik;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

public interface KorisnikService {
    public void register(Korisnik korisnik);
    public Korisnik login(Korisnik korisnik);
    public Optional<Korisnik> getKorisnik(String email);
    public Korisnik getKorisnikByEmail(String email);
    public ResponseEntity<?> updateKorisnik(Korisnik korisnik, Map<String, Object> body);
}
