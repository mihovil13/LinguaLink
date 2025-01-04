package com.example.demo.repository;

import com.example.demo.model.Jezik;
import com.example.demo.model.Korisnik;
import org.springframework.data.relational.core.sql.In;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface JezikRepository extends CrudRepository<Jezik, Integer> {
    Optional<Jezik> findByNazivJezika(String nazivJezika);
    Jezik getJezikByNazivJezika(String nazivJezika);
}
