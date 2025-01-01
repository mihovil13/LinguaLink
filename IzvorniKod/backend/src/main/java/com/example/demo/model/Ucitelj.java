package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

@Entity
@AllArgsConstructor
@Table(name="ucitelji")
public class Ucitelj extends Korisnik {
    @Column(name = "ucitelj_id")
    private Long ucitelj_id;
    @Enumerated(EnumType.STRING)
    private Role role;



    private String iskustvo;
    private String kvalifikacije;
    private String satnica;
    private String stilPoducavanja;

    public Ucitelj(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    public Ucitelj(String ime, String prezime, String email, String lozinka, String uloga) {
        super(ime, prezime, email, lozinka, uloga);
    }

    public Ucitelj() {

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