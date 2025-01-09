package com.example.demo.service;

import com.example.demo.model.Predavanje;

public interface PredavanjeService {
    Predavanje getPredavanjeById(int id);
    void savePredavanje(Predavanje predavanje);
}
