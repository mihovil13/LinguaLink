package com.example.demo.service;

import com.example.demo.model.Ucenik;
import com.example.demo.repository.UcenikRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UcenikServiceJPA implements UcenikService {
    private final UcenikRepository ucenikRepository;
    public UcenikServiceJPA(UcenikRepository ucenikRepository) {
        this.ucenikRepository = ucenikRepository;
    }
    @Override
    public void saveUcenik(Ucenik ucenik) {
        ucenikRepository.save(ucenik);
    }

    @Override
    public Ucenik getUcenik(String email) {
        return ucenikRepository.getUcenikByEmail(email);
    }

    @Override
    public ResponseEntity<?> updateUcenik(Ucenik ucenik, Map<String,Object> body) {
        System.out.println( body);
        ucenik.setIme(body.get("ime").toString());
        ucenik.setPrezime(body.get("prezime").toString());
        ucenik.setEmail(body.get("email").toString());
        /*if (body.containsKey("languagesKnown")) {
            ucenik.setLanguagesKnown((List<String>) body.get("languagesKnown"));
        }
        if (body.containsKey("languagesToLearn")) {
            ucenik.setLanguagesToLearn((List<String>) body.get("languagesToLearn"));
        }*/
        if (body.containsKey("ciljeviUcenja")) {
            ucenik.setCiljevi((String) body.get("ciljeviUcenja"));
        }
        if (body.containsKey("stilPoducavanja")) {
            ucenik.setStilPoducavanja((String) body.get("stilPoducavanja"));
        }


        return ResponseEntity.ok(ucenikRepository.save(ucenik));
    }
}
