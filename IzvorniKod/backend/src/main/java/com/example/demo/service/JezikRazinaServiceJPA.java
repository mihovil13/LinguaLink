package com.example.demo.service;

import com.example.demo.repository.JezikRazinaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

@Service
public class JezikRazinaServiceJPA implements JezikRazinaService{
    @Autowired
    private JezikRazinaRepository jezikRazinaRepository;
   @Transactional
    public void delete(Long id){
        jezikRazinaRepository.deleteByJezikRazinaID(id);
    }
}
