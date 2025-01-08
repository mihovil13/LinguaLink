package com.example.demo.service;

import com.example.demo.model.Ucitelj;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UciteljService {
    public List<Ucitelj> getUcitelji();
    public Ucitelj getUciteljiByEmail(String email);
    public void saveUcitelj(Ucitelj ucitelj);
    public ResponseEntity<?> updateUcitelj(Ucitelj ucitelj, Map<String, Object> body);
    public Ucitelj getUciteljById(Long id);

}
