package com.example.demo.controller;

import com.example.demo.service.UciteljServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ucitelj")
public class ViewUciteljController {

    @Autowired
    private final UciteljServiceJPA uciteljService;

    public ViewUciteljController(UciteljServiceJPA uciteljService) {
        this.uciteljService = uciteljService;
    }

    // Endpoint za učitavanje profila učitelja
    @GetMapping("/{id}")
    public ResponseEntity<List<com.example.demo.model.Ucitelj>> getUcitelj() {
        List<com.example.demo.model.Ucitelj> ucitelji = uciteljService.getUcitelji();
        System.out.println("Ucitelji");
        System.out.println(ucitelji);
        return ResponseEntity.ok(ucitelji);
    }


    public ResponseEntity<?> getUciteljById(@PathVariable int id) {
        Ucitelj ucitelj = UCITELJI.get(id);

        if (ucitelj != null) {
            return ResponseEntity.ok(ucitelj);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Učitelj s ID-om " + id + " nije pronađen.");
        }
    }

    // Klasa za model učitelja
    public static class Ucitelj {
        private int id;
        private String ime;
        private String predmet;

        public Ucitelj(int id, String ime, String predmet) {
            this.id = id;
            this.ime = ime;
            this.predmet = predmet;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getIme() {
            return ime;
        }

        public void setIme(String ime) {
            this.ime = ime;
        }

        public String getPredmet() {
            return predmet;
        }

        public void setPredmet(String predmet) {
            this.predmet = predmet;
        }
    }
}