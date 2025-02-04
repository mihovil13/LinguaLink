package com.example.demo.repository;

import com.example.demo.model.Ucenik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UcenikRepository extends CrudRepository<Ucenik, Long> {
    public Ucenik getUcenikByEmail(String email);
    //@Query(value = "select * from ucenici where user_id=:id" , nativeQuery = true)
    public Ucenik getUcenikById(Long id);
}