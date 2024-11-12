package com.example.demo.service;

import com.example.demo.model.Korisnik;
import com.example.demo.repository.KorisnikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class KorisnikServiceJPA implements KorisnikService {
    private final KorisnikRepository korisnikRepository;

    @Autowired
    public KorisnikServiceJPA(KorisnikRepository korisnikRepository){
        this.korisnikRepository = korisnikRepository;
    }
    @Override
    public void register(Korisnik korisnik) {
        Optional<Korisnik> existingKorisnik = korisnikRepository.findByEmail(korisnik.getEmail());
        if (existingKorisnik.isPresent()) {
            throw new IllegalArgumentException("Korisnik sa ovim email-om već postoji.");
        }
        Korisnik korisnik1 = new Korisnik(korisnik.getEmail(), korisnik.getLozinka());
        korisnikRepository.save(korisnik1);
    }

    @Override
    public Korisnik login(Korisnik korisnik) {
        Optional<Korisnik> existingKorisnik = korisnikRepository.findByEmailAndLozinka(korisnik.getEmail(), korisnik.getLozinka());
        if (existingKorisnik.isEmpty()) {
            throw new IllegalArgumentException("Neispravni podaci za prijavu.");
        }
        System.out.println("NOVI KORISNIK SE ULOGIRAO!!");
        return existingKorisnik.get();
    }
}
