package com.example.demo.service;

import com.example.demo.model.Ucenik;
import com.example.demo.repository.UcenikRepository;
import com.example.demo.repository.jezikRazinaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UcenikServiceJPA implements UcenikService {
    private final UcenikRepository ucenikRepository;
<<<<<<< Updated upstream
    public UcenikServiceJPA(UcenikRepository ucenikRepository) {
        this.ucenikRepository = ucenikRepository;
=======
    private final UciteljServiceJPA uciteljServiceJPA;
    private final JezikServiceJPA jezikServiceJPA;
    private final jezikRazinaRepository jezikRazinaRepository;
    public UcenikServiceJPA(UcenikRepository ucenikRepository, UciteljServiceJPA uciteljServiceJPA, JezikServiceJPA jezikServiceJPA, jezikRazinaRepository jezikRazinaRepository) {
        this.ucenikRepository = ucenikRepository;
        this.uciteljServiceJPA = uciteljServiceJPA;
        this.jezikServiceJPA = jezikServiceJPA;
        this.jezikRazinaRepository= jezikRazinaRepository;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            ucenik.setLanguagesKnown((List<Map<String, String>>) body.get("languagesKnown"));
        }
        if (body.containsKey("languagesToLearn")) {
=======
            List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesKnown");
            List<String> jezikOdvojeno = jezici.stream()
                    .map(lang -> lang.get("language") + "-" + lang.get("level")).toList();
            System.out.println(jezikOdvojeno);
            List<JezikRazina> dobraLista = new ArrayList<>();
            for(String jezik:jezikOdvojeno) {
                String[] jezik1 = jezik.split("-");
                String jezik2 = jezik1[0];
                String razina = jezik1[1];
                Razina razina1 = Razina.valueOf(razina);

                Jezik jezik3 = jezikServiceJPA.getJezikByNazivJezika(jezik2);
                JezikRazina jezikRazina = new JezikRazina(ucenik, jezik3, razina1);
                jezikRazinaRepository.save(jezikRazina);
                dobraLista.add(jezikRazina);
            }
            ucenik.setJeziciRazine(dobraLista);

            ucenik.setLanguagesKnown((List<Map<String, String>>) body.get("languagesKnown"));
        }
        if (body.containsKey("languagesToLearn")) {
            List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesToLearn");
            List<String> jezikOdvojeno = jezici.stream()
                    .map(lang -> (String) lang.get("language")).toList();
            List<Jezik> dobraLista = new ArrayList<>();
            for(String jezik:jezikOdvojeno){
                Jezik jezik1 = jezikServiceJPA.getJezikByNazivJezika(jezik);
                dobraLista.add(jezik1);
            }
            ucenik.setJezici(dobraLista);
            System.out.println("DobraLista: ");
            System.out.println(dobraLista);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
}
