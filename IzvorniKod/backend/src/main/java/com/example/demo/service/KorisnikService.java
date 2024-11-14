package com.example.demo.service;

import com.example.demo.model.Korisnik;

import java.util.Optional;

public interface KorisnikService {
    public void register(Korisnik korisnik);
    public Korisnik login(Korisnik korisnik);
    public Optional<Korisnik> getKorisnik(String email);
}
