package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Entity
@AllArgsConstructor
@Table(name="ucitelji")
public class Ucitelj extends Korisnik {


    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToMany
    @JoinTable(
            name = "UciteljJezik",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "jezik_id")
    )
    private List<Jezik> jezici2 = new ArrayList<>();

    private String iskustvo;
    private String kvalifikacije;
    private String satnica;
    private String languagesTeach;
    private String stilPoducavanja;

    public Ucitelj(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    public Ucitelj(String ime, String prezime, String email, String lozinka, String uloga) {
        super(ime, prezime, email, lozinka, uloga);
    }

    public Ucitelj() {

    }

    public List<Jezik> getJezici2() {
        return jezici2;
    }

    public void setJezici2(List<Jezik> jezici2) {
        this.jezici2 = jezici2;
    }

    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
    }

    public String getKvalifikacije() {
        return kvalifikacije;
    }

    public void setKvalifikacije(String kvalifikacije) {
        this.kvalifikacije = kvalifikacije;
    }

    public String getSatnica() {
        return satnica;
    }

    public void setSatnica(String satnica) {
        this.satnica = satnica;
    }
    public String getStilPoducavanja() {
        return stilPoducavanja;
    }

    public void setStilPoducavanja(String stilPoducavanja) {
        this.stilPoducavanja = stilPoducavanja;
    }

    public String getLanguagesTeach() {
        return languagesTeach;
    }

    public void setLanguagesTeach(List<Map<String, String>> languages) {
        this.languagesTeach = languages.stream()
                .map(lang -> (String) lang.get("language"))
                .collect(Collectors.joining(", "));
    }
}
//    public Ucitelj(String ime, String prezime, String email, String lozinka) {
//        super(ime, prezime, email, lozinka);
//    }
//
//    public Long getUcitelj_id() {
//        return ucitelj_id;
//    }
//
//    public Integer getGodine_iskustva() {
//        return godine_iskustva;
//    }
//
//    public void setGodine_iskustva(Integer godine_iskustva) {
//        this.godine_iskustva = godine_iskustva;
//    }
//
//    public String getKvalifikacije() {
//        return kvalifikacije;
//    }
//
//    public void setKvalifikacije(String kvalifikacije) {
//        this.kvalifikacije = kvalifikacije;
//    }
//
//    public String getSatnica() {
//        return satnica;
//    }
//
//    public void setSatnica(String satnica) {
//        this.satnica = satnica;
//    }
//}
//