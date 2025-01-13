package com.example.demo.DTO;

import java.time.LocalDateTime;

public class PredavanjeDTO {
    private Integer ucenikId;
    private Integer uciteljId;
    private LocalDateTime datumVrijemePocetka;

    // Getteri i setteri
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
}
