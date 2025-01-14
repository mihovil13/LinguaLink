package com.example.demo.controller;

import com.example.demo.model.Predavanje;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.PredavanjeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.DTO.PredavanjeDTO;

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
    public ResponseEntity<String> savePredavanje(@RequestBody PredavanjeDTO predavanjeDTO) {
        // Kreiranje i spremanje Predavanje objekta
        Predavanje predavanje = new Predavanje(
                predavanjeDTO.getUcenikId(),
                predavanjeDTO.getUciteljId(),
                predavanjeDTO.getDatumVrijemePocetka()
        );

        predavanjeService.savePredavanje(predavanje);

        return ResponseEntity.ok("Predavanje uspješno spremljeno");
    }

    @GetMapping("/dohvati-predavanja/{id}")
    public ResponseEntity<List<Predavanje>> getPredavanjaByUciteljId(@PathVariable int id) {
        List<Predavanje> predavanja = predavanjeService.getPredavanjaByUciteljId(id);
        return ResponseEntity.ok(predavanja);
    }

    @PutMapping("/prihvati-predavanje/{id}")
    public ResponseEntity<String> prihvatiPredavanje(@PathVariable Integer id) {
        predavanjeService.updatePotvrdeno(id, 1);
        return ResponseEntity.ok("Predavanje uspješno prihvaćeno");
    }

    @PutMapping("/otkazi-predavanje/{id}")
    public ResponseEntity<String> otkaziPredavanje(@PathVariable Integer id) {
        predavanjeService.updatePotvrdeno(id, -1);
        return ResponseEntity.ok("Predavanje uspješno otkazano");
    }

    @GetMapping("/dohvati-predavanja-ucenik/{id}")
    public ResponseEntity<List<Predavanje>> getPredavanjaByUcenikId(@PathVariable int id) {
        List<Predavanje> predavanja = predavanjeService.getPredavanjaByUcenikId(id);
        return ResponseEntity.ok(predavanja);
    }
}
