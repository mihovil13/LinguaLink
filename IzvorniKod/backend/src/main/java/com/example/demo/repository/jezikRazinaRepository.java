package com.example.demo.repository;

import com.example.demo.model.Jezik;
import com.example.demo.model.JezikRazina;
import org.springframework.data.repository.CrudRepository;

public interface jezikRazinaRepository extends CrudRepository<JezikRazina, Integer> {
}
