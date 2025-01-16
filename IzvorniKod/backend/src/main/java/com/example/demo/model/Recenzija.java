package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "recenzije")
public class Recenzija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String komentar;
    private Integer ocjena;

    public Recenzija(Integer ocjena, String komentar) {
        this.ocjena = ocjena;
        this.komentar = komentar;
    }
    @ManyToOne
    @JsonBackReference
    private Ucenik ucenik;

    @ManyToOne
    @JsonBackReference
    private Ucitelj ucitelj;

    public Recenzija() {

    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }


    public String getKomentar() {
        return komentar;
    }

    public void setKomentar(String komentar) {
        this.komentar = komentar;
    }

    public Integer getOcjena() {
        return ocjena;
    }

    public void setOcjena(Integer ocjena) {
        this.ocjena = ocjena;
    }

    public Ucenik getUcenik() {
        return ucenik;
    }

    public void setUcenik(Ucenik ucenik) {
        this.ucenik = ucenik;
    }

    public Ucitelj getUcitelj() {
        return ucitelj;
    }

    public void setUcitelj(Ucitelj ucitelj) {
        this.ucitelj = ucitelj;
    }
}
