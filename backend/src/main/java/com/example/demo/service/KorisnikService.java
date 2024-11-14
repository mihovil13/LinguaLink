package com.example.demo.service;

import com.example.demo.model.Korisnik;

public interface KorisnikService {
    public void register(Korisnik korisnik);
    public Korisnik login(Korisnik korisnik);
}
