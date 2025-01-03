package com.example.demo.repository;

import com.example.demo.model.Jezik;
import com.example.demo.model.Korisnik;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface JezikRepository extends CrudRepository<Jezik, Long>
{
    Optional<Jezik> findByNazivJezika(String nazivJezika);
}
