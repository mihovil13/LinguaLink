package com.example.demo.repository;

import com.example.demo.model.JezikRazina;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JezikRazinaRepository extends CrudRepository<JezikRazina, Long> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM ucenik_jezik_razina WHERE jezik_razinaid = :id", nativeQuery = true)
    void deleteByJezikRazinaID(@Param("id") Long id);


}
