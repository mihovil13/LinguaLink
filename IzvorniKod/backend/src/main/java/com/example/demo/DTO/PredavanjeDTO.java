package com.example.demo.DTO;

import java.time.LocalDateTime;

public class PredavanjeDTO {
    private Integer predavanjeId;
    private Integer ucenikId;
    private Integer uciteljId;
    private LocalDateTime datumVrijemePocetka;
    private Integer potvrdeno;
    private String ucenikIme;
    private String ucenikPrezime;
    private String uciteljIme;
    private String uciteljPrezime;
    private String materijal;

    // Getteri i setteri
    public Integer getPredavanjeId() {
        return predavanjeId;
    }
    public void setPredavanjeId(Integer predavanjeId) {
        this.predavanjeId = predavanjeId;
    }
    public Integer getUcenikId() {
        return ucenikId;
    }

    public void setUcenikId(Integer ucenikId) {
        this.ucenikId = ucenikId;
    }

    public Integer getUciteljId() {
        return uciteljId;
    }

    public void setUciteljId(Integer uciteljId) {
        this.uciteljId = uciteljId;
    }

    public LocalDateTime getDatumVrijemePocetka() {
        return datumVrijemePocetka;
    }

    public void setDatumVrijemePocetka(LocalDateTime datumVrijemePocetka) {
        this.datumVrijemePocetka = datumVrijemePocetka;
    }

    public Integer getPotvrdeno() {
        return potvrdeno;
    }

    public void setPotvrdeno(Integer potvrdeno) {
        this.potvrdeno = potvrdeno;
    }

    public String getUcenikIme() {
        return ucenikIme;
    }

    public void setUcenikIme(String ucenikIme) {
        this.ucenikIme = ucenikIme;
    }

    public String getUcenikPrezime() {
        return ucenikPrezime;
    }

    public void setUcenikPrezime(String ucenikPrezime) {
        this.ucenikPrezime = ucenikPrezime;
    }

    public String getUciteljIme() {
        return uciteljIme;
    }

    public void setUciteljIme(String uciteljIme) {
        this.uciteljIme = uciteljIme;
    }

    public String getUciteljPrezime() {
        return uciteljPrezime;
    }

    public void setUciteljPrezime(String uciteljPrezime) {
        this.uciteljPrezime = uciteljPrezime;
    }

    public String getMaterijal() {
        return materijal;
    }

    public void setMaterijal(String materijal) {
        this.materijal = materijal;
    }
}
