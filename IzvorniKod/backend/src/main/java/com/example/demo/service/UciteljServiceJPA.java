package com.example.demo.service;

import com.example.demo.model.Ucitelj;
import com.example.demo.repository.UciteljRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UciteljServiceJPA implements UciteljService {

    private final UciteljRepository uciteljRepository;

    public UciteljServiceJPA(UciteljRepository uciteljRepository) {
        this.uciteljRepository = uciteljRepository;
    }

    @Override
    public List<Ucitelj> getUcitelji() {
        return uciteljRepository.findAll();
    }
}
