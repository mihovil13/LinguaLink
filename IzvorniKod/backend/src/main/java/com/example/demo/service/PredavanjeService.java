package com.example.demo.service;

import com.example.demo.model.Predavanje;

import java.util.List;

public interface PredavanjeService {
    void savePredavanje(Predavanje predavanje);

    List<Predavanje> getPredavanjaByUciteljId(int uciteljId);

    void updatePotvrdeno(Integer predavanjeId, Integer potvrdeno);

    List<Predavanje> getPredavanjaByUcenikId(int ucenikId); // Nova metoda
}
