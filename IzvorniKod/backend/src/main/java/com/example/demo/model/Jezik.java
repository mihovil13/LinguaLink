package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@Table(name="jezici")
public class Jezik {
    @Id
    @Column(name = "jezik_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jezik_id;

    private String nazivJezika;

    @ManyToMany(mappedBy = "languagesToLearn", fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Ucenik> ucenikList = new ArrayList<>();

    @ManyToMany(mappedBy = "languagesTeach", fetch = FetchType.EAGER)
    @JsonBackReference
    private List<Ucitelj> uciteljList = new ArrayList<>();

    @OneToMany(mappedBy = "jezik", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<JezikRazina> jeziciRazine = new ArrayList<>();

    public Jezik() {

    }

    public Jezik(String nazivJezika) {
        //this.jezik_id = jezik_id;
        this.nazivJezika = nazivJezika;

    }

    public void setJezik_id(Integer jezik_id) {
        this.jezik_id = jezik_id;
    }

    public List<Ucitelj> getUciteljList() {
        return uciteljList;
    }

    public void setUciteljList(List<Ucitelj> uciteljList) {
        this.uciteljList = uciteljList;
    }

    public List<JezikRazina> getJeziciRazine() {
        return jeziciRazine;
    }

    public void setJeziciRazine(List<JezikRazina> jeziciRazine) {
        this.jeziciRazine = jeziciRazine;
    }

    public Integer getLanguageId() {
        return jezik_id;
    }

    public void setLanguageId(Integer jezikId) {
        this.jezik_id = jezik_id;
    }

    public String getNazivJezika() {
        return nazivJezika;
    }

    public void setNazivJezika(String nazivJezika) {
        this.nazivJezika = nazivJezika;
    }

    public List<Ucenik> getUcenikList() {
        return ucenikList;
    }

    public void setUcenikList(List<Ucenik> ucenikList) {
        this.ucenikList = ucenikList;
    }


    public Integer getJezik_id() {
        return jezik_id;
    }
}
