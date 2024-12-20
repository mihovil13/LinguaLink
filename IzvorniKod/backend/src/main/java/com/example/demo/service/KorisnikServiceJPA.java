package com.example.demo.service;

import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.repository.UcenikRepository;
import com.example.demo.repository.UciteljRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class KorisnikServiceJPA implements KorisnikService {
    private final KorisnikRepository korisnikRepository;
    private final UcenikRepository ucenikRepository;
    private final UciteljRepository uciteljRepository;

    public KorisnikServiceJPA(KorisnikRepository korisnikRepository, UcenikRepository ucenikRepository, UciteljRepository uciteljRepository) {
        this.korisnikRepository = korisnikRepository;
        this.ucenikRepository = ucenikRepository;
        this.uciteljRepository = uciteljRepository;
    }


    @Override
    public void register(Korisnik korisnik) {
        Optional<Korisnik> existingKorisnik = korisnikRepository.findByEmail(korisnik.getEmail());
        if (existingKorisnik.isPresent()) {
            throw new IllegalArgumentException("Korisnik sa ovim email-om već postoji.");
        }
        String username = String.format("%s %s",korisnik.getIme(),korisnik.getPrezime());

        Korisnik korisnik1 = new Korisnik(username,korisnik.getEmail(), korisnik.getLozinka(), korisnik.getUloga());
        if(korisnik.getUloga().equals("Učenik")){
            System.out.println("ucenik");
            Ucenik ucenik = new Ucenik(korisnik.getIme(),korisnik.getPrezime(),korisnik.getEmail(),korisnik.getLozinka(), korisnik.getUloga());
            ucenikRepository.save(ucenik);
        }
        if(korisnik.getUloga().equals("Učitelj")){
            System.out.println("ucitelj");
            Ucitelj ucitelj = new Ucitelj(korisnik.getIme(),korisnik.getPrezime(),korisnik.getEmail(),korisnik.getLozinka(), korisnik.getUloga());
            uciteljRepository.save(ucitelj);
        }

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

    public Optional<Korisnik> getKorisnik(String email) {
        return korisnikRepository.findByEmail(email);
    }
}
