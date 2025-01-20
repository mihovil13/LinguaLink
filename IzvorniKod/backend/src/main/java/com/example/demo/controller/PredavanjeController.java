package com.example.demo.controller;

import com.example.demo.DTO.PredavanjeDTO;
import com.example.demo.model.Predavanje;
import com.example.demo.service.PredavanjeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

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

    @GetMapping("/dohvati-materijale/{id}")
    public ResponseEntity<PredavanjeDTO> getPredavanjeById(@PathVariable int id) {
        Predavanje predavanje = predavanjeService.getPredavanjeById(id);
        PredavanjeDTO dto = new PredavanjeDTO();
        dto.setPredavanjeId(predavanje.getPredavanjeId());
        dto.setUcenikId(predavanje.getUcenikId());
        dto.setUciteljId(predavanje.getUciteljId());
        dto.setDatumVrijemePocetka(predavanje.getDatumVrijemePocetka());
        dto.setPotvrdeno(predavanje.getPotvrdeno());
        dto.setMaterijal(predavanje.getMaterijal());
        dto.setUcenikIme(predavanje.getUcenik().getIme());
        dto.setUcenikPrezime(predavanje.getUcenik().getPrezime());
        dto.setUciteljIme(predavanje.getUcitelj().getIme());
        dto.setUciteljPrezime(predavanje.getUcitelj().getPrezime());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/postavi-materijale/{id}")
    public ResponseEntity<String> postaviMaterijal(@PathVariable int id, @RequestBody String materijal) {
        try {
            predavanjeService.postaviMaterijal(id, materijal);
            return ResponseEntity.ok("Materijal uspješno postavljen.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Predavanje s ID-jem " + id + " nije pronađeno.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Došlo je do pogreške prilikom postavljanja materijala.");
        }
    }

}
