package com.example.demo.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Embeddable
public class JezikRazina {
    private Integer jezik_id;
    private Razina razina;

    public JezikRazina(Jezik jezik, Razina razina) {
        this.jezik_id = jezik_id;
        this.razina = razina;
    }

    public JezikRazina() {

    }

    public Integer getJezikID() { return jezik_id;}

    public Razina getRazina() { return razina;}

    public void setJezik(Integer jezik_id) {
        this.jezik_id = jezik_id;
    }

    public void setRazina(Razina razina) {
        this.razina = razina;
    }
}
