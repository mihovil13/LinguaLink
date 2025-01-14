package com.example.demo.service;

import com.example.demo.model.Jezik;
import com.example.demo.repository.JezikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JezikServiceJPA implements JezikService {
    @Autowired
    private JezikRepository jezikRepository;

    public void saveLanguages() {
        List<Jezik> languages = List.of(
                new Jezik("Engleski"),
                new Jezik("Njemački"),
                new Jezik("Francuski"),
                new Jezik("Španjolski"),
                new Jezik("Talijanski"),
                new Jezik("Portugalski"),
                new Jezik("Ruski"),
                new Jezik("Hindi"),
                new Jezik("Arapski"),
                new Jezik("Mandarinski"),
                new Jezik("Japanski")
        );
        for(Jezik jezik: languages) {
            System.out.println(jezik);
            jezikRepository.save(jezik);
        }
        //jezikRepository.saveAll(languages);
    }
    public Jezik getJezikByNazivJezika(String name) {
        return jezikRepository.getJezikByNazivJezika(name);
    }
}
