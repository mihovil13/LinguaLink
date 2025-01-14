package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@Getter
@Setter
@Table(name = "predavanja")
public class Predavanje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "predavanje_id")
    private Integer predavanjeId;

    @Column(name = "ucenik_id", nullable = false)
    private Integer ucenikId;

    @Column(name = "ucitelj_id", nullable = false)
    private Integer uciteljId;

    @Column(name = "datum_vrijeme_pocetka", nullable = false)
    private LocalDateTime datumVrijemePocetka;

    @Column(name = "potvrdeno", nullable = false, columnDefinition = "INTEGER DEFAULT 0")
    private Integer potvrdeno = 0;

    public Predavanje() {
        // Default konstruktor
    }

    public Predavanje(Integer ucenikId, Integer uciteljId, LocalDateTime datumVrijemePocetka) {
        this.ucenikId = ucenikId;
        this.uciteljId = uciteljId;
        this.datumVrijemePocetka = datumVrijemePocetka;
    }

    @ManyToOne
    @JoinColumn(name = "ucenik_id", insertable = false, updatable = false)
    private Ucenik ucenik;

    @ManyToOne
    @JoinColumn(name = "ucitelj_id", insertable = false, updatable = false)
    private Ucitelj ucitelj;

    // Getteri i setteri za ucenik i ucitelj
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
