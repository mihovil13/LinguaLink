package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ucenik_jezik_razina")
public class JezikRazina  {
    @Enumerated(EnumType.STRING)
    private Razina razina;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jezik_razina_id;

    public JezikRazina(Razina razina) {
        this.razina = razina;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Jezik jezik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    private Ucenik ucenik;

    public JezikRazina() {

    }

    public JezikRazina(Ucenik ucenik, Jezik jezik, Razina razina) {
        this.ucenik = ucenik;
        this.jezik = jezik;
        this.razina = razina;
    }

    public Jezik getJezik() {
        return jezik;
    }

    public void setJezik(Jezik jezik) {
        this.jezik = jezik;
    }

    public Ucenik getUcenik() {
        return ucenik;
    }

    public void setUcenik(Ucenik ucenik) {
        this.ucenik = ucenik;
    }

    public Razina getRazina() { return razina;}


    public void setRazina(Razina razina) {
        this.razina = razina;
    }

    public void setJezik_razina_id(Long jezikRazinaId) {
        this.jezik_razina_id = jezikRazinaId;
    }

    public Long getJezik_razina_id() {
        return jezik_razina_id;
    }
}
