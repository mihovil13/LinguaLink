package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/teachers")
public class UciteljController {
    @Autowired
    private final UciteljServiceJPA uciteljService;
    @Autowired
    private final UcenikServiceJPA ucenikService;
    @Autowired
    private JwtService jwtService;

    public UciteljController(UciteljServiceJPA uciteljService, UcenikServiceJPA ucenikService) {
        this.uciteljService = uciteljService;
        this.ucenikService = ucenikService;
    }

    @GetMapping
    public ResponseEntity<List<Ucitelj>> getUcitelj(@RequestHeader(value = "Authentication", required = false) String token, @RequestBody Map<String, Object> body) {
        if(token!= null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = jwtService.extractUsername(token);
            Ucenik ucenik = ucenikService.getUcenik(email);
            return ucenikService.filterData(ucenik,body);
        }else{
            List<Ucitelj> ucitelji = uciteljService.getUcitelji();
            System.out.println(ucitelji);
            return ResponseEntity.ok(ucitelji);
        }

    }

}
