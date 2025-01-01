package com.example.demo.model;

import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@AllArgsConstructor
@Table(name="jezici")
public class Jezik {
    @Id
    @Column(name = "jezikId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jezikId;

    private String nazivJezika;

    public Jezik() {

    }

    public Integer getLanguageId() {
        return jezikId;
    }

    public void setLanguageId(Integer jezikId) {
        this.jezikId = jezikId;
    }

    public String getNazivJezika() {
        return nazivJezika;
    }

    public void setNazivJezika(String nazivJezika) {
        this.nazivJezika = nazivJezika;
    }
}