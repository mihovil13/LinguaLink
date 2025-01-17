package com.example.demo.service;

import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UcenikService {
    public void saveUcenik(Ucenik ucenik);
    public Ucenik getUcenik(String email);
    public ResponseEntity<?> updateUcenik(Ucenik ucenik, Map<String, Object> body);
    public Ucenik  getUcenikById(Long id);
}
