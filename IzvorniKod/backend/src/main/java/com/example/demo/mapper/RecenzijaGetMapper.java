package com.example.demo.mapper;

import com.example.demo.DTO.RecenzijaGetDTO;
import com.example.demo.model.Recenzija;
import com.example.demo.model.Ucenik;
import com.example.demo.service.UcenikServiceJPA;

public class RecenzijaGetMapper {
    private final UcenikServiceJPA ucenikServiceJPA;

    public RecenzijaGetMapper(UcenikServiceJPA ucenikServiceJPA) {
        this.ucenikServiceJPA = ucenikServiceJPA;
    }

    public  RecenzijaGetDTO recenzijaToDTO(Recenzija recenzija) {
        RecenzijaGetDTO recenzijaGetDTO = new RecenzijaGetDTO();
        recenzijaGetDTO.setKomentar(recenzija.getKomentar());
        recenzijaGetDTO.setOcjena(recenzija.getOcjena());
        Ucenik ucenik = ucenikServiceJPA.getUcenikById(recenzija.getUcenik().getId().longValue());
        recenzijaGetDTO.setIme(ucenik.getIme());
        recenzijaGetDTO.setPrezime(ucenik.getPrezime());
        return recenzijaGetDTO;
    }
}
