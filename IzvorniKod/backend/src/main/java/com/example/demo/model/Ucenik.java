package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@AllArgsConstructor
@Table(name="ucenici")
public class Ucenik extends Korisnik{
    @Column(name = "ucenik_id")
    private Long ucenik_id;
    @Enumerated(EnumType.STRING)
    private Role role;

    public Ucenik(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }



    private String languagesKnown;
    private String languagesToLearn;
    private String ciljeviUcenja;
    private String stilPoducavanja;

    public Ucenik(String ime, String prezime, String email, String lozinka, String uloga) {
        super(ime, prezime, email, lozinka, uloga);
    }

    public Ucenik() {

    }

    public String getLanguagesKnown() {
        return languagesKnown;
    }

    public void setLanguagesKnown(List<Map<String, String>> languages ) {
        this.languagesKnown = languages.stream()
                .map(lang -> lang.get("language") + "-" + lang.get("level"))
                .collect(Collectors.joining(", "));
    }

    public String getLanguagesToLearn() {
        return languagesToLearn;
    }

    public void setLanguagesToLearn(List<Map<String, String>> languages) {
        this.languagesToLearn = languages.stream()
                .map(lang -> (String) lang.get("language"))
                .collect(Collectors.joining(", "));
    }

    public String getCiljeviUcenja() {
        return ciljeviUcenja;
    }

    public void setCiljevi(String ciljeviUcenja) {
        this.ciljeviUcenja = ciljeviUcenja;
    }

    public String getStilPoducavanja() {
        return stilPoducavanja;
    }

    public void setStilPoducavanja(String stilPoducavanja) {
        this.stilPoducavanja = stilPoducavanja;
    }



}

//    @Override
//    public String toString() {
//        return "Ucenik{}"+super.toString();
//    }
//    public Long getUcenik_id() {
//        return ucenik_id;
//    }
//}
//