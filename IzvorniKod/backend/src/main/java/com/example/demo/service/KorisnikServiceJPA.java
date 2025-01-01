package com.example.demo.service;

import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.repository.UcenikRepository;
import com.example.demo.repository.UciteljRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;


@Service
public class KorisnikServiceJPA implements KorisnikService {
    private final KorisnikRepository korisnikRepository;
    private final UcenikRepository ucenikRepository;
    private final UciteljRepository uciteljRepository;
    private final UcenikServiceJPA ucenikServiceJPA;
    private final UciteljServiceJPA uciteljServiceJPA;

    public KorisnikServiceJPA(KorisnikRepository korisnikRepository, UcenikRepository ucenikRepository, UciteljRepository uciteljRepository, UcenikServiceJPA ucenikServiceJPA, UciteljServiceJPA uciteljServiceJPA) {
        this.korisnikRepository = korisnikRepository;
        this.ucenikRepository = ucenikRepository;
        this.uciteljRepository = uciteljRepository;
        this.ucenikServiceJPA = ucenikServiceJPA;
        this.uciteljServiceJPA = uciteljServiceJPA;
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

    @Override
    public Korisnik getKorisnikByEmail(String email) {
        return korisnikRepository.getKorisnikByEmail(email);
    }

    @Override
    public ResponseEntity<?> updateKorisnik(Korisnik korisnik, Map<String, Object> body) {
        System.out.println(korisnik.getUloga());
        if(korisnik.getUloga().equals("Učitelj")){
            Ucitelj ucitelj = uciteljServiceJPA.getUciteljiByEmail(korisnik.getEmail());
            return uciteljServiceJPA.updateUcitelj(ucitelj,body);

        }
        if(korisnik.getUloga().equals("Učenik")){
            Ucenik ucenik = ucenikServiceJPA.getUcenik(korisnik.getEmail());
            return ucenikServiceJPA.updateUcenik(ucenik,body);

        }
        return ResponseEntity.notFound().build();   
    }


    /**
     * Pohranjuje korisnika iz OAuth2 tokena.
     *
     * @param email   Email korisnika iz tokena
     * @param name    Ime korisnika iz tokena
     * @param uloga   Uloga korisnika (npr. "Učenik" ili "Učitelj")
     */
    public void saveKorisnikFromToken(String email, String name, String uloga) {
        // Provjeri postoji li korisnik u bazi
        Optional<Korisnik> existingKorisnik = korisnikRepository.findByEmail(email);
        if (existingKorisnik.isEmpty()) {
            // Ako korisnik ne postoji, kreiraj novog
            Korisnik noviKorisnik = new Korisnik();
            noviKorisnik.setEmail(email);
            noviKorisnik.setIme(name.split(" ")[0]); // Pretpostavka: prvo ime
            noviKorisnik.setPrezime(name.split(" ").length > 1 ? name.split(" ")[1] : ""); // Pretpostavka: drugo prezime
            noviKorisnik.setLozinka("default_lozinka");
            noviKorisnik.setUloga(uloga);
            korisnikRepository.save(noviKorisnik);
        }
    }


}
