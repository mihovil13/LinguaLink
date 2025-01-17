package com.example.demo.service;


import com.example.demo.model.Recenzija;
import com.example.demo.repository.RecenzijaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class RecenzijaServiceJPA implements RecenzijaService {
    private RecenzijaRepository recenzijaRepository;

    public RecenzijaServiceJPA(RecenzijaRepository recenzijaRepository) {
        this.recenzijaRepository = recenzijaRepository;
    }

    public ResponseEntity<?> saveRecenzija(Recenzija recenzija) {
        return ResponseEntity.ok(recenzijaRepository.save(recenzija));
    }

}