package com.example.demo.controller;

import com.example.demo.model.Predavanje;
import com.example.demo.service.PredavanjeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zabiljezi-predavanje")
public class PredavanjeController {

    private final PredavanjeService predavanjeService;

    @Autowired
    public PredavanjeController(PredavanjeService predavanjeService) {
        this.predavanjeService = predavanjeService;
    }

    @PostMapping
    public ResponseEntity<String> savePredavanje(@RequestBody Predavanje predavanje) {
        predavanjeService.savePredavanje(predavanje);
        // Vraća HTTP status 200 (OK) s odgovarajućom porukom
        return new ResponseEntity<>("Predavanje uspješno spremljeno", HttpStatus.OK);
    }

    //ZASAD NETREBA
    /*@GetMapping("/{id}")
    public Predavanje getPredavanje(@PathVariable int id) {
        return predavanjeService.getPredavanjeById(id);
    }*/


}
