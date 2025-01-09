package com.example.demo.service;

import com.example.demo.model.Predavanje;

import java.util.List;

public interface PredavanjeService {
    Predavanje getPredavanjeById(int id);
    void savePredavanje(Predavanje predavanje);
    List<Predavanje> getPredavanjaByUciteljId(int uciteljId);
}
