package com.example.demo.service;

import com.example.demo.users.Korisnik;
import org.springframework.stereotype.Service;

@Service
public class KorisnikServiceJPA implements KorisnikService {

    @Override
    public void addKorisnik(Korisnik korisnik) {
            System.out.println(korisnik.getIme());
            System.out.println(korisnik.getPrezime());
    }
}
