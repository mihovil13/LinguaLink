package com.example.demo.service;

import com.example.demo.model.Korisnik;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface KorisnikService {
    public void register(Korisnik korisnik);
    public Optional<Korisnik> getKorisnik(String email);
    public Korisnik getKorisnikByEmail(String email);
    public ResponseEntity<?> updateKorisnik(Korisnik korisnik, Map<String, Object> body);

    public List<Korisnik> getAllUsersExceptAdmins();

    boolean deleteUserById(Long id);
}
