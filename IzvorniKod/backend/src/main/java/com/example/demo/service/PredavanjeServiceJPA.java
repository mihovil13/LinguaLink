package com.example.demo.service;

import com.example.demo.model.Predavanje;
import com.example.demo.repository.PredavanjeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredavanjeServiceJPA implements PredavanjeService {

    private final PredavanjeRepository predavanjeRepository;

    @Autowired
    public PredavanjeServiceJPA(PredavanjeRepository predavanjeRepository) {
        this.predavanjeRepository = predavanjeRepository;
    }


    @Override
    public void savePredavanje(Predavanje predavanje) {
        predavanjeRepository.save(predavanje);
    }

    @Override
    public List<Predavanje> getPredavanjaByUciteljId(int uciteljId) {
        return predavanjeRepository.findByUciteljId(uciteljId);
    }
}
