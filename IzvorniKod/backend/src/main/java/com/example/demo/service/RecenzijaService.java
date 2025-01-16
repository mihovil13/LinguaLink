package com.example.demo.service;

import com.example.demo.model.Recenzija;
import org.springframework.http.ResponseEntity;

public interface RecenzijaService {
    public ResponseEntity<?> saveRecenzija(Recenzija recenzija);
}
