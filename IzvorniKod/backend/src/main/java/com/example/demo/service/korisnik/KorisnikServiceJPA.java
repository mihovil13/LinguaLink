package com.example.demo.service.korisnik;

import com.example.demo.repository.KorisnikRepo;
import com.example.demo.users.Korisnik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class KorisnikServiceJPA implements KorisnikService {
    @Autowired
    private KorisnikRepo korisnikRepo;
    @Autowired
    private PasswordEncoder bCryptPasswordEncoder;
    @Override
    public Korisnik addKorisnik(Korisnik korisnik) {
        if(!korisnikRepo.findByEmail(korisnik.getEmail())){
            throw new IllegalArgumentException(
                    "Korisnik already exists!"
            );

        }
        Korisnik korisnik1 = new Korisnik();
        korisnik1.setEmail(korisnik.getEmail());
        korisnik1.setIme(korisnik.getIme());
        korisnik1.setPrezime(korisnik.getPrezime());
        korisnik1.setLozinka(bCryptPasswordEncoder.encode(korisnik.getLozinka()));
        return korisnikRepo.save(korisnik);
    }
}
