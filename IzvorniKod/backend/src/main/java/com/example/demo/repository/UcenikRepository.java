package com.example.demo.repository;

import com.example.demo.model.Ucenik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UcenikRepository extends CrudRepository<Ucenik, Long> {
    public Ucenik getUcenikByEmail(String email);
}
