package com.example.demo.config;

import com.example.demo.repository.KorisnikRepo;
import com.example.demo.users.Korisnik;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class CustomUserDetailsService  {
/*
    private KorisnikRepo korisnikRepo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Korisnik korisnik = korisnikRepo.findByIme(email);
        if (korisnik == null) {
            throw new UsernameNotFoundException(email);
        }
        return new (korisnik.getIme(),korisnik.getPrezime(),korisnik.getLozinka(),korisnik.getEmail());
    }*/
}
