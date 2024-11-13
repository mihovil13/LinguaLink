package com.example.demo.repository;

import com.example.demo.model.Korisnik;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface KorisnikRepository extends CrudRepository<Korisnik, Long> {
    Optional<Korisnik> findByEmail(String email);
    Optional<Korisnik> findByEmailAndLozinka(String email, String lozinka);
}
