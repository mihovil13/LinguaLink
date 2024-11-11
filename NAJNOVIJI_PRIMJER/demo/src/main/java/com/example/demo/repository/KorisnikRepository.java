package com.example.demo.repository;

import com.example.demo.model.Korisnik;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface KorisnikRepository extends CrudRepository<Korisnik, Long> {
    Optional<Korisnik> findByEmail(String email);
    Optional<Korisnik> findByEmailAndLozinka(String email, String lozinka);
}
