package com.example.demo.users;

import jakarta.persistence.*;

@Entity


public class Ucitelj extends Korisnik{

    private Integer godine_iskustva;
    private String kvalifikacije;
    private Integer satnica ;

    public Ucitelj(String ime, String prezime, String lozinka, String email) {
        super(ime, prezime, lozinka, email);
    }

    public Ucitelj(String ime, String prezime, String lozinka, String email, Integer godine_iskustva, String kvalifikacije, Integer satnica) {
        super(ime, prezime, lozinka, email);
        this.godine_iskustva = godine_iskustva;
        this.kvalifikacije = kvalifikacije;
        this.satnica = satnica;
    }

    public Ucitelj() {

    }

    public Integer getGodine_iskustva() {
        return godine_iskustva;
    }

    public void setGodine_iskustva(Integer godine_iskustva) {
        this.godine_iskustva = godine_iskustva;
    }

    public String getKvalifikacije() {
        return kvalifikacije;
    }

    public void setKvalifikacije(String kvalifikacije) {
        this.kvalifikacije = kvalifikacije;
    }

    public Integer getSatnica() {
        return satnica;
    }

    public void setSatnica(Integer satnica) {
        this.satnica = satnica;
    }
}
