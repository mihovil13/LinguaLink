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

    @OneToMany(mappedBy = "ucenik",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Recenzija> recenzije = new ArrayList<Recenzija>();

    public void setCiljeviUcenja(String ciljeviUcenja) {
        this.ciljeviUcenja = ciljeviUcenja;
    }

    @Override
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Ucenik(String ime, String prezime, String email, String lozinka, String uloga, Role role) {
        super(ime, prezime, email, lozinka, uloga, role);
    }

    public Ucenik() {

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

    public List<Recenzija> getRecenzije() {
        return recenzije;
    }

    public void setRecenzije(List<Recenzija> recenzije) {
        this.recenzije = recenzije;
    }
    public Integer getId(){
        return super.getUser_id();
    }

}


