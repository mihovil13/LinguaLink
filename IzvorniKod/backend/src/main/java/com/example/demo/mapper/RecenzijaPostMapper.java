package com.example.demo.mapper;

import com.example.demo.DTO.RecenzijaPostDTO;
import com.example.demo.model.Recenzija;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;

public class RecenzijaPostMapper {
    private final UcenikServiceJPA ucenikServiceJPA;
    private final UciteljServiceJPA uciteljServiceJPA;

    public RecenzijaPostMapper(UcenikServiceJPA ucenikServiceJPA, UciteljServiceJPA uciteljServiceJPA) {
        this.ucenikServiceJPA = ucenikServiceJPA;
        this.uciteljServiceJPA = uciteljServiceJPA;
    }

    public Recenzija toRecenzija(RecenzijaPostDTO recenzijaPostDTO){
        Recenzija recenzija = new Recenzija();
        recenzija.setKomentar(recenzijaPostDTO.getKomentar());
        recenzija.setOcjena(recenzijaPostDTO.getOcjena());
        Ucenik ucenik = ucenikServiceJPA.getUcenikById(recenzijaPostDTO.getUcenikId());
        recenzija.setUcenik(ucenik);
        Long id = recenzijaPostDTO.getUciteljId();
        Ucitelj ucitelj = uciteljServiceJPA.getUciteljById(id);
        recenzija.setUcitelj(ucitelj);
        return recenzija;
    }
}