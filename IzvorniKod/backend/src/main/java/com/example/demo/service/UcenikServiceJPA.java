package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.JezikRazinaRepository;
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
    private final JezikRazinaRepository jezikRazinaRepository;
    private final JezikRazinaServiceJPA jezikRazinaServiceJPA;
    public UcenikServiceJPA(UcenikRepository ucenikRepository, UciteljServiceJPA uciteljServiceJPA, JezikServiceJPA jezikServiceJPA, JezikRazinaRepository jezikRazinaRepository, JezikRazinaServiceJPA jezikRazinaServiceJPA) {
        this.ucenikRepository = ucenikRepository;
        this.uciteljServiceJPA = uciteljServiceJPA;
        this.jezikServiceJPA = jezikServiceJPA;
        this.jezikRazinaRepository = jezikRazinaRepository;
        this.jezikRazinaServiceJPA = jezikRazinaServiceJPA;
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
        if(body.get("languagesKnown") == null) {
            System.out.println("langknown: ");
            System.out.println(body.get("languagesKnown"));
        }

       // Ucenik ucenik1 = ucenikRepository.getUcenikByEmail(ucenik.getEmail());
        if (body.containsKey("languagesKnown") && body.get("languagesKnown") != null) {
            System.out.println("JEZIIk");

            List<Map<String,String>> jezici =(List<Map<String,String>>) body.get("languagesKnown");
            List<String> jezikOdvojeno = jezici.stream()
                    .map(lang -> lang.get("nazivJezika") + "-" + lang.get("razina")).toList();

            System.out.println(jezikOdvojeno);
            List<JezikRazina> dobraLista = new ArrayList<JezikRazina>();
            List<Jezik> pomocnaLista = new ArrayList<>();
            List<Razina> pomocna2 = new ArrayList<>();
            Ucenik ucenik1 = ucenikRepository.getUcenikByEmail(ucenik.getEmail());
            for(JezikRazina jezikRazina:ucenik1.getLanguagesKnown()){
                jezikRazinaServiceJPA.delete(jezikRazina.getJezik_razina_id());
            }

            for(String jezik:jezikOdvojeno){
                Integer brojac = 0;
                String[] jezik1 = jezik.split("-");
                String jezik2 = jezik1[0];

                String razina = jezik1[1];
                System.out.println("Razina: ");
                System.out.println(razina);
                Razina razina1 = Razina.valueOf(razina);
                Jezik jezik3 = jezikServiceJPA.getJezikByNazivJezika(jezik2);
                pomocnaLista.add(jezik3);
                pomocna2.add(razina1);
                JezikRazina jezikRazina = new JezikRazina(ucenik,jezik3,razina1);
                dobraLista.add(jezikRazina);

//                for(JezikRazina jezikRazina: ucenik1.getLanguagesKnown()){
//                    if(!jezikRazina.getJezik().getNazivJezika().equals(jezik2)){
//                       brojac++;
//                    }
//                }
//                if(brojac==ucenik1.getLanguagesKnown().size()){
//                    JezikRazina jezikRazina2 = new JezikRazina(ucenik,jezik3,razina1);
//                    dobraLista.add(jezikRazina2);
//                }
            }


//                for(JezikRazina jezikRazina: ucenik1.getLanguagesKnown()){
//
//                    if(!pomocnaLista.contains(jezikRazina.getJezik())){
//                        System.out.println("NIJE U NOVOJ AL JE U STAROJ");
//                        System.out.println(jezikRazina.getJezik().getNazivJezika());
//                        jezikRazinaServiceJPA.delete(jezikRazina.getJezik_razina_id());
//                    }
//                }
                ucenik.setLanguagesKnown(dobraLista);
                ucenikRepository.save(ucenik);


            }


            System.out.println("NOVALISTA");
            //System.out.println(novaLista);

           /* if(dobraLista.size()==ucenik1.getLanguagesKnown().size()){
                Integer brojac = 0;
                for(JezikRazina jezikRazina1: dobraLista){
                    if(ucenik1.getLanguagesKnown().contains(jezikRazina1)){
                        brojac++;
                    }

                }
                if(brojac != ucenik1.getLanguagesKnown().size()){
                    ucenik.setLanguagesKnown(dobraLista);
                }
            }else{
                System.out.println("Prije seta");
                System.out.println(dobraLista);
                System.out.println(ucenik.getLanguagesKnown());
                ucenik.setLanguagesKnown(dobraLista);
                System.out.println("Nakon seta");
                System.out.println(ucenik.getLanguagesKnown());
            }

            System.out.println("DobraLista: ");
            System.out.println(dobraLista);
            ucenik.setLanguagesKnown(dobraLista);
            */
           // ucenik.setLanguagesKnown((List<Map<String, String>>) body.get("languagesKnown"));

        if (body.containsKey("languagesToLearn") && body.get("languagesToLearn")!=null) {
            List<Map<String,String>> jezici2 =(List<Map<String,String>>) body.get("languagesToLearn");
            List<String> jezikOdvojeno = jezici2.stream()
                    .map(lang -> (String) lang.get("nazivJezika")).toList();
            List<Jezik> dobraLista = new ArrayList<Jezik>();

            System.out.println("Lista odvojeno");
            System.out.println(jezikOdvojeno);


            for(String jezik:jezikOdvojeno){
                Jezik jezik1 = jezikServiceJPA.getJezikByNazivJezika(jezik);
                dobraLista.add(jezik1);
            }
            System.out.println("DORA LISTA1");
            System.out.println(dobraLista);
//            Ucenik ucenik1 = ucenikRepository.getUcenikByEmail(ucenik.getEmail());
//            List<Jezik> novaLista = new ArrayList<>();
//            for(Jezik jezik:dobraLista){
//                if(!ucenik1.getLanguagesKnown().contains(jezik)){
//                    novaLista.add(jezik);
//                }
//            }
            ucenik.setLanguagesToLearn(dobraLista);



            //ucenik.setLanguagesToLearn(dobraLista);
            //ucenik.setLanguagesToLearn((List<Map<String, String>>) body.get("languagesToLearn"));
        }
        if (body.containsKey("ciljeviUcenja")) {
            ucenik.setCiljevi((String) body.get("ciljeviUcenja"));
        }
        if (body.containsKey("stilPoducavanja")) {
            ucenik.setStilPoducavanja((String) body.get("stilPoducavanja"));
        }


        return ResponseEntity.ok(ucenikRepository.save(ucenik));
    }


}
