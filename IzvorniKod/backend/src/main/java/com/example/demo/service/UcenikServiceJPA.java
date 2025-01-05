package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.UcenikRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class UcenikServiceJPA implements UcenikService {
    private final UcenikRepository ucenikRepository;
    private final UciteljServiceJPA uciteljServiceJPA;
    private final JezikServiceJPA jezikServiceJPA;
    public UcenikServiceJPA(UcenikRepository ucenikRepository, UciteljServiceJPA uciteljServiceJPA, JezikServiceJPA jezikServiceJPA) {
        this.ucenikRepository = ucenikRepository;
        this.uciteljServiceJPA = uciteljServiceJPA;
        this.jezikServiceJPA = jezikServiceJPA;
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
        if (body.containsKey("languagesKnown")) {
            List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesKnown");
            List<String> jezikOdvojeno = jezici.stream()
                    .map(lang -> lang.get("language") + "-" + lang.get("level")).toList();
            System.out.println(jezikOdvojeno);
            List<JezikRazina> dobraLista = new ArrayList<JezikRazina>();
            for(String jezik:jezikOdvojeno){
                String[] jezik1 = jezik.split("-");
                String jezik2 = jezik1[0];
                String razina = jezik1[1];
                Razina razina1 = Razina.valueOf(razina);

                Jezik jezik3 = jezikServiceJPA.getJezikByNazivJezika(jezik2);
                JezikRazina jezikRazina = new JezikRazina(ucenik,jezik3,razina1);
                dobraLista.add(jezikRazina);
            }
            System.out.println("DobraLista: ");
            System.out.println(dobraLista);
            ucenik.setJeziciRazine(dobraLista);

            ucenik.setLanguagesKnown((List<Map<String, String>>) body.get("languagesKnown"));
        }
        if (body.containsKey("languagesToLearn")) {
            List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesToLearn");
            List<String> jezikOdvojeno = jezici.stream()
                    .map(lang -> (String) lang.get("language")).toList();
            List<Jezik> dobraLista = new ArrayList<Jezik>();
            for(String jezik:jezikOdvojeno){
                Jezik jezik1 = jezikServiceJPA.getJezikByNazivJezika(jezik);
                dobraLista.add(jezik1);
            }
            ucenik.setJezici(dobraLista);
            ucenik.setLanguagesToLearn((List<Map<String, String>>) body.get("languagesToLearn"));
        }
        if (body.containsKey("ciljeviUcenja")) {
            ucenik.setCiljevi((String) body.get("ciljeviUcenja"));
        }
        if (body.containsKey("stilPoducavanja")) {
            ucenik.setStilPoducavanja((String) body.get("stilPoducavanja"));
        }


        return ResponseEntity.ok(ucenikRepository.save(ucenik));
    }

    @Override
    public ResponseEntity<List<Ucitelj>> filterData(Ucenik ucenik, Map<String, Object> body) {
        String languagesToLearn = ucenik.getLanguagesToLearn();
        List<Ucitelj> listaUcitelja = uciteljServiceJPA.getUcitelji();
        for (Ucitelj ucitelj : listaUcitelja) {
            if(!ucitelj.getLanguagesTeach().equals(languagesToLearn)){
                listaUcitelja.remove(ucitelj);
            }
        }
        return ResponseEntity.ok(listaUcitelja);
    }
}
