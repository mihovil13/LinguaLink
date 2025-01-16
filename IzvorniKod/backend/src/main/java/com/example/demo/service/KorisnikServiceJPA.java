package com.example.demo.service;

import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.repository.UcenikRepository;
import com.example.demo.repository.UciteljRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
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
        if (body.containsKey("uloga") && korisnik.getUloga()==null) {
            korisnik.setUloga((String) body.get("uloga"));
            if(korisnik.getUloga().equals("Učitelj")){
                Ucitelj ucitelj = new Ucitelj(korisnik.getIme(),korisnik.getPrezime(),korisnik.getEmail(),korisnik.getLozinka(), korisnik.getUloga());
                korisnikRepository.delete(korisnik);
                uciteljRepository.save(ucitelj);
            }
            if(korisnik.getUloga().equals("Učenik")){
                Ucenik ucenik = new Ucenik(korisnik.getIme(),korisnik.getPrezime(),korisnik.getEmail(),korisnik.getLozinka(), korisnik.getUloga());
                korisnikRepository.delete(korisnik);
                ucenikRepository.save(ucenik);
            }
        }
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

    @Override
    public List<Korisnik> getAllUsersExceptAdmins() {
        return korisnikRepository.findByUlogaNot("Admin");
    }
    @Override
    public boolean deleteUserById(Long id) {
        if (korisnikRepository.existsById(id)) {
            korisnikRepository.deleteById(id);
            return true;
        } else {
            return false; // Korisnik s danim ID-em ne postoji
        }
    }
}
