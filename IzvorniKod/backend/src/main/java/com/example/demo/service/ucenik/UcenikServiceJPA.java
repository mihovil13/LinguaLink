package com.example.demo.service.ucenik;

import com.example.demo.repository.UcenikRepo;
import com.example.demo.service.ucenik.UcenikService;
import com.example.demo.users.Ucenik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UcenikServiceJPA implements UcenikService {
    @Autowired
    private UcenikRepo studentRepo;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Ucenik addStudent(Ucenik ucenik) {
        ucenik.setLozinka(passwordEncoder.encode(ucenik.getLozinka()));
        return studentRepo.save(ucenik);
    }
}
