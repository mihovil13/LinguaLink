package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@AllArgsConstructor
@Table(name="ucenici")
public class Ucenik extends Korisnik{


    @Enumerated(EnumType.STRING)
    private Role role;

    public Ucenik(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    /*private String languagesKnown;
    private String languagesToLearn;
    */
    private String ciljeviUcenja;
    private String stilPoducavanja;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "UcenikJezik",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "jezik_id")
    )
    @JsonManagedReference
    private List<Jezik> languagesToLearn = new ArrayList<>();

    @OneToMany(mappedBy = "ucenik",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<JezikRazina> languagesKnown = new ArrayList<JezikRazina>();

    public void setCiljeviUcenja(String ciljeviUcenja) {
        this.ciljeviUcenja = ciljeviUcenja;
    }
/*
    public List<JezikRazina> getJeziciRazine() {
        return jeziciRazine;
    }

    public void setJeziciRazine(List<JezikRazina> jeziciRazine) {
        this.jeziciRazine = jeziciRazine;
    }

    public List<Jezik> getJezici() {
        return jezici;
    }

    public void setJezici(List<Jezik> jezici) {
        this.jezici = jezici;
    }

    public void setLanguagesToLearn(String languagesToLearn) {
        this.languagesToLearn = languagesToLearn;
    }

    public void setLanguagesKnown(String languagesKnown) {
        this.languagesKnown = languagesKnown;
    }
*/
    @Override
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Ucenik(String ime, String prezime, String email, String lozinka, String uloga) {
        super(ime, prezime, email, lozinka, uloga);
    }

    public Ucenik() {

    }
/*
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
*/
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

    public List<Jezik> getLanguagesToLearn() {
        return languagesToLearn;
    }

    public void setLanguagesToLearn(List<Jezik> languagesToLearn) {
        this.languagesToLearn = languagesToLearn;
    }

    public List<JezikRazina> getLanguagesKnown() {
        return languagesKnown;
    }

    public void setLanguagesKnown(List<JezikRazina> languagesKnown) {
        this.languagesKnown = languagesKnown;
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