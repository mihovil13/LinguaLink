package com.example.demo.service;

import com.example.demo.model.Ucenik;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface UcenikService {
    public void saveUcenik(Ucenik ucenik);
    public Ucenik getUcenik(String email);
    public ResponseEntity<?> updateUcenik(Ucenik ucenik, Map<String, Object> body);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
}
