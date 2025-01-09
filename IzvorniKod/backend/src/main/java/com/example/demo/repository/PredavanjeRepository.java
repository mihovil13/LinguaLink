package com.example.demo.repository;

import com.example.demo.model.Predavanje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PredavanjeRepository extends JpaRepository<Predavanje, Integer> {

    @Query("SELECT p FROM Predavanje p WHERE p.ucitelj.user_id = :uciteljId")
    List<Predavanje> findByUciteljId(@Param("uciteljId") Integer uciteljId);

}
