package com.example.demo.service;

import com.example.demo.model.Jezik;
import com.example.demo.model.Qualifications;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.UciteljRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class  UciteljServiceJPA implements UciteljService {

    private final UciteljRepository uciteljRepository;
    private final JezikServiceJPA jezikServiceJPA;

    public UciteljServiceJPA(UciteljRepository uciteljRepository, JezikServiceJPA jezikServiceJPA) {
        this.uciteljRepository = uciteljRepository;
        this.jezikServiceJPA = jezikServiceJPA;
    }

    @Override
    public List<Ucitelj> getUcitelji() {
        return uciteljRepository.findAll();
    }

    @Override
    public Ucitelj getUciteljiByEmail(String email) {
        return uciteljRepository.getUciteljByEmail(email);
    }

    @Override
    public void saveUcitelj(Ucitelj ucitelj) {
        uciteljRepository.save(ucitelj);
    }

    @Override
    public ResponseEntity<?> updateUcitelj(Ucitelj ucitelj, Map<String,Object> body) {
            ucitelj.setIme(body.get("ime").toString());
            ucitelj.setPrezime(body.get("prezime").toString());
            ucitelj.setEmail(body.get("email").toString());
            if (body.containsKey("qualifications") && body.get("qualifications")!=null) {
                List<Map<String,String>> qualifications = (List<Map<String,String>>) body.get("qualifications");
                List<String> qualOdvojeno = qualifications.stream()
                        .map(lang->(String)lang.get("kvalifikacije")).toList();

                Set<Qualifications> qualificationsList = new HashSet<>();
                for (String qualification : qualOdvojeno) {
                    qualificationsList.add(Enum.valueOf(Qualifications.class, qualification));
                }
                ucitelj.setQualifications(qualificationsList);

            }
            if (body.containsKey("iskustvo")) {
                ucitelj.setIskustvo((String) body.get("iskustvo"));
            }
            if (body.containsKey("languagesTeach") && body.get("languagesTeach")!=null) {
                List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesTeach");
                List<String> jezikOdvojeno = jezici.stream()
                        .map(lang -> (String) lang.get("nazivJezika")).toList();
                List<Jezik> dobraLista = new ArrayList<Jezik>();
                for(String jezik:jezikOdvojeno){
                    Jezik jezik1 = jezikServiceJPA.getJezikByNazivJezika(jezik);
                    dobraLista.add(jezik1);
                }

                ucitelj.setLanguagesTeach(dobraLista);

            }
            if (body.containsKey("satnica")) {
                ucitelj.setSatnica((String) body.get("satnica"));
            }
            if (body.containsKey("stilPoducavanja")) {
                ucitelj.setStilPoducavanja((String) body.get("stilPoducavanja"));
            }
            return ResponseEntity.ok( uciteljRepository.save(ucitelj));
    }
    @Override
    public Ucitelj getUciteljById(Long id) {
        return uciteljRepository.getUciteljById(id);    }
}
