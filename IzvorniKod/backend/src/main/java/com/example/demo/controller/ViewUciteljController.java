package com.example.demo.controller;

import com.example.demo.model.Ucitelj;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public Ucitelj getUcitelj(@PathVariable long id) {
        Ucitelj ucitelj = uciteljService.getUciteljById(id);
        return ucitelj;
    }
}
