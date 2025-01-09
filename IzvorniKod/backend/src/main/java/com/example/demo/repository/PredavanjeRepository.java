package com.example.demo.repository;

import com.example.demo.model.Predavanje;
import org.springframework.data.repository.CrudRepository;

public interface PredavanjeRepository extends CrudRepository<Predavanje, Integer> {
    public Predavanje getPredavanjeById(int id);

    public void savePredavanje(Predavanje predavanje);
}
