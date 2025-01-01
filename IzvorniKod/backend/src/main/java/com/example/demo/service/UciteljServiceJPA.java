package com.example.demo.service;

import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.UciteljRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UciteljServiceJPA implements UciteljService {

    private final UciteljRepository uciteljRepository;

    public UciteljServiceJPA(UciteljRepository uciteljRepository) {
        this.uciteljRepository = uciteljRepository;
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
            if (body.containsKey("kvalifikacije")) {
                ucitelj.setKvalifikacije((String) body.get("kvalifikacije"));
            }
            if (body.containsKey("iskustvo")) {
                ucitelj.setIskustvo((String) body.get("iskustvo"));
            }
            if (body.containsKey("satnica")) {
                ucitelj.setSatnica((String) body.get("satnica"));
            }
            if (body.containsKey("stilPoducavanja")) {
                ucitelj.setStilPoducavanja((String) body.get("stilPoducavanja"));
            }
            return ResponseEntity.ok( uciteljRepository.save(ucitelj));
    }
}
