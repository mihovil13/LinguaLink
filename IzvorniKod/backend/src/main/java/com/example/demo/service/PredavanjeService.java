package com.example.demo.service;

import com.example.demo.DTO.PredavanjeDTO;
import com.example.demo.model.Predavanje;

import java.util.List;

public interface PredavanjeService {
    void savePredavanje(Predavanje predavanje);

    List<PredavanjeDTO> getPredavanjaByUciteljId(int uciteljId);

    void updatePotvrdeno(Integer predavanjeId, Integer potvrdeno);

    List<PredavanjeDTO> getPredavanjaByUcenikId(int ucenikId); // Nova metoda

    Predavanje getPredavanjeById(Integer id);
}
