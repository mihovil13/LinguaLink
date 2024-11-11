package com.example.demo.service.ucenik;

import com.example.demo.repository.UcenikRepo;
import com.example.demo.service.ucenik.UcenikService;
import com.example.demo.users.Ucenik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UcenikServiceJPA implements UcenikService {

    private UcenikRepo ucenikRepo;

    @Autowired
    public UcenikServiceJPA(UcenikRepo ucenikRepo) {
        this.ucenikRepo = ucenikRepo;
    }


    public List<Ucenik> getUcenici(){
        return ucenikRepo.findAll();
    }
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public Ucenik addUcenik(Ucenik ucenik) {
        ucenik.setLozinka(passwordEncoder.encode(ucenik.getLozinka()));
        return ucenikRepo.save(ucenik);
    }
}