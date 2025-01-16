package com.example.demo.controller;

import com.example.demo.DTO.RecenzijaPostDTO;
import com.example.demo.mapper.RecenzijaPostMapper;
import com.example.demo.model.Recenzija;
import com.example.demo.service.RecenzijaServiceJPA;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecenzijeController {
    private final UcenikServiceJPA ucenikServiceJPA;
    private final UciteljServiceJPA uciteljServiceJPA;
    private final RecenzijaServiceJPA recenzijaServiceJPA;
    public RecenzijeController(UcenikServiceJPA ucenikServiceJPA, UciteljServiceJPA uciteljServiceJPA, RecenzijaServiceJPA recenzijaServiceJPA) {
        this.ucenikServiceJPA = ucenikServiceJPA;
        this.uciteljServiceJPA = uciteljServiceJPA;
        this.recenzijaServiceJPA = recenzijaServiceJPA;
    }

    @PostMapping("/api/recenzije")
    public ResponseEntity<?> fetchRecenzija(@RequestBody RecenzijaPostDTO recenzija) {
        RecenzijaPostMapper mapper = new RecenzijaPostMapper(ucenikServiceJPA, uciteljServiceJPA);
        return recenzijaServiceJPA.saveRecenzija(mapper.toRecenzija(recenzija));
    }

}
