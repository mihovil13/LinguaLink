package com.example.demo.repository;

import com.example.demo.users.Korisnik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KorisnikRepo extends JpaRepository<Korisnik,Long> {

    boolean findByEmail(String email);
}
