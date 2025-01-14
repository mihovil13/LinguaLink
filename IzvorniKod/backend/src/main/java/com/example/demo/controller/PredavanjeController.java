package com.example.demo.controller;

import com.example.demo.DTO.PredavanjeDTO;
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

    @GetMapping("/dohvati-predavanja/{id}")
    public ResponseEntity<List<PredavanjeDTO>> getPredavanjaByUciteljId(@PathVariable int id) {
        List<PredavanjeDTO> predavanja = predavanjeService.getPredavanjaByUciteljId(id);
        return ResponseEntity.ok(predavanja);
    }

    @GetMapping("/dohvati-predavanja-ucenik/{id}")
    public ResponseEntity<List<PredavanjeDTO>> getPredavanjaByUcenikId(@PathVariable int id) {
        List<PredavanjeDTO> predavanja = predavanjeService.getPredavanjaByUcenikId(id);
        return ResponseEntity.ok(predavanja);
    }
}
