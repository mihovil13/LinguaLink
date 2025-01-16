package com.example.demo.controller;

import com.example.demo.DTO.RecenzijaGetDTO;
import com.example.demo.DTO.RecenzijaPostDTO;
import com.example.demo.mapper.RecenzijaGetMapper;
import com.example.demo.mapper.RecenzijaPostMapper;
import com.example.demo.model.Recenzija;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.PredavanjeServiceJPA;
import com.example.demo.service.RecenzijaServiceJPA;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class RecenzijeController {
    private final UcenikServiceJPA ucenikServiceJPA;
    private final UciteljServiceJPA uciteljServiceJPA;
    private final RecenzijaServiceJPA recenzijaServiceJPA;
    private final PredavanjeServiceJPA predavanjeServiceJPA;

    public RecenzijeController(UcenikServiceJPA ucenikServiceJPA, UciteljServiceJPA uciteljServiceJPA, RecenzijaServiceJPA recenzijaServiceJPA, PredavanjeServiceJPA predavanjeServiceJPA) {
        this.ucenikServiceJPA = ucenikServiceJPA;
        this.uciteljServiceJPA = uciteljServiceJPA;
        this.recenzijaServiceJPA = recenzijaServiceJPA;
        this.predavanjeServiceJPA = predavanjeServiceJPA;
    }

    @PostMapping("/api/recenzije")
    public ResponseEntity<?> fetchRecenzija(@RequestBody RecenzijaPostDTO recenzija) {
        RecenzijaPostMapper mapper = new RecenzijaPostMapper(ucenikServiceJPA, uciteljServiceJPA, predavanjeServiceJPA);
        return recenzijaServiceJPA.saveRecenzija(mapper.toRecenzija(recenzija));
    }

    @GetMapping("/api/recenzije/{id}")
    public ResponseEntity<List<RecenzijaGetDTO>> sendRecenzije(@PathVariable Long id) {
        List<RecenzijaGetDTO> lista = new ArrayList<>();
        Ucitelj ucitelj = uciteljServiceJPA.getUciteljById(id);
        List<Recenzija> listaRecenzija = ucitelj.getRecenzija2();
        RecenzijaGetMapper mapper = new RecenzijaGetMapper(ucenikServiceJPA);
        for(Recenzija r : listaRecenzija) {
            RecenzijaGetDTO dto = mapper.recenzijaToDTO(r);
            lista.add(dto);
        }
        return ResponseEntity.ok(lista);
    }
    @GetMapping("/api/recenzije-ucenik/{id}")
    public ResponseEntity<List<RecenzijaGetDTO>> sendRecenzijeUcenik(@PathVariable Long id) {
        List<RecenzijaGetDTO> lista = new ArrayList<>();
        Ucenik ucenik = ucenikServiceJPA.getUcenikById(id);
        List<Recenzija> listaRecenzija = ucenik.getRecenzije();
        RecenzijaGetMapper mapper = new RecenzijaGetMapper(ucenikServiceJPA);
        for(Recenzija r:listaRecenzija){
            RecenzijaGetDTO dto = mapper.recenzijaToDTO(r);
            lista.add(dto);
        }
        return ResponseEntity.ok(lista);
    }



}