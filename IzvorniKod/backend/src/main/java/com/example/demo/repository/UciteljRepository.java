package com.example.demo.repository;

import com.example.demo.model.Ucitelj;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Repository
public interface UciteljRepository extends CrudRepository<Ucitelj, Long> {
    public List<Ucitelj> findAll();
    public Ucitelj getUciteljByEmail(String email);
}
