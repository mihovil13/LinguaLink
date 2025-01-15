package com.example.demo.controller;

import com.example.demo.model.Ucitelj;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/teachers")
public class UciteljController {
    @Autowired
    private final UciteljServiceJPA uciteljService;

    public UciteljController(UciteljServiceJPA uciteljService) {
        this.uciteljService = uciteljService;
    }

    @GetMapping
    public ResponseEntity<List<Ucitelj>> getUcitelj() {
        List<Ucitelj> ucitelji = uciteljService.getUcitelji();
        System.out.println("Ucitelji");
        System.out.println(ucitelji);
        return ResponseEntity.ok(ucitelji);
    }

}
