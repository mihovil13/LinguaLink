package com.example.demo.controller;

import com.example.demo.model.Predavanje;
import com.example.demo.service.PredavanjeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PredavanjeController {

    private final PredavanjeService predavanjeService;

    @Autowired
    public PredavanjeController(PredavanjeService predavanjeService) {
        this.predavanjeService = predavanjeService;
    }

    @PostMapping("/zabiljezi-predavanje")
    public ResponseEntity<String> savePredavanje(@RequestBody Predavanje predavanje) {
        predavanjeService.savePredavanje(predavanje);
        return ResponseEntity.ok("Predavanje uspješno spremljeno");
    }

    @GetMapping("/dohvati-predavanja/{id}")
    public ResponseEntity<List<Predavanje>> getPredavanjaByUciteljId(@PathVariable int id) {
        List<Predavanje> predavanja = predavanjeService.getPredavanjaByUciteljId(id);
        return ResponseEntity.ok(predavanja);
    }
}
