package com.example.demo.mapper;

import com.example.demo.DTO.KorisnikGetDTO;
import com.example.demo.model.*;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class KorisnikGetMapper {

    private final UcenikServiceJPA ucenikServiceJPA;
    private final UciteljServiceJPA uciteljServiceJPA;

    public KorisnikGetMapper(UcenikServiceJPA ucenikServiceJPA, UciteljServiceJPA uciteljServiceJPA) {
        this.ucenikServiceJPA = ucenikServiceJPA;
        this.uciteljServiceJPA = uciteljServiceJPA;
    }



    public  KorisnikGetDTO korisnikGetDTO(Korisnik korisnik) {
        KorisnikGetDTO korisnikGetDTO = new KorisnikGetDTO();
        korisnikGetDTO.setIme(korisnik.getIme());
        korisnikGetDTO.setPrezime(korisnik.getPrezime());
        korisnikGetDTO.setId(korisnik.getUser_id());
        korisnikGetDTO.setUloga(korisnik.getUloga());
        korisnikGetDTO.setEmail(korisnik.getEmail());
        if (korisnik.getSlika() != null) {
            korisnikGetDTO.setSlika(korisnik.getSlika());
        }

        if(korisnik.getUloga()!=null){
            if(korisnik.getUloga().equals("Učenik")){
                Ucenik ucenik = ucenikServiceJPA.getUcenik(korisnik.getEmail());
                List<JezikRazina> listaJezikaRazine = ucenik.getLanguagesKnown();
                List<String> dobralista = listaJezikaRazine.stream()
                        .map(lang -> lang.getJezik().getNazivJezika() + "-" + lang.getRazina().toString())
                        .collect(Collectors.toList());

                korisnikGetDTO.setCiljeviUcenja(ucenik.getCiljeviUcenja());
                korisnikGetDTO.setStilPoducavanja(ucenik.getStilPoducavanja());
                korisnikGetDTO.setLanguagesKnown(dobralista);

                korisnikGetDTO.setLanguagesToLearn(ucenik.getLanguagesToLearn());

                List<Jezik> languagesTeach = new ArrayList<>();
                korisnikGetDTO.setLanguagesTeach(languagesTeach);
            }
             if(korisnik.getUloga().equals("Učitelj")){
                Ucitelj ucitelj = uciteljServiceJPA.getUciteljiByEmail(korisnik.getEmail());
                korisnikGetDTO.setLanguagesTeach(ucitelj.getLanguagesTeach());
                korisnikGetDTO.setIskustvo(ucitelj.getIskustvo());
                korisnikGetDTO.setSatnica(ucitelj.getSatnica());
                korisnikGetDTO.setStilPoducavanja(ucitelj.getStilPoducavanja());
                Set<Qualifications> qualifications = ucitelj.getQualifications();
                List<String> quals = new ArrayList<>();


                for(Qualifications q : qualifications){

                    if(q==(Qualifications.Izvorni_govornik)){

                        quals.add("Izvorni_govornik");
                    }else{
                        quals.add(q.toString());
                    }

                }

                korisnikGetDTO.setQualifications(quals);
                List<String> jezikRazinas = new ArrayList<>();
                List<Jezik> jezici = new ArrayList<>();
                korisnikGetDTO.setLanguagesKnown(jezikRazinas);
                korisnikGetDTO.setLanguagesToLearn(jezici);

            }
        }


        return korisnikGetDTO;
    }
}
