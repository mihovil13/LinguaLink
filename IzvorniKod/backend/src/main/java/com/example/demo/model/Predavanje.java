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

    public Predavanje() {
        // Default konstruktor
    }

    public Predavanje(Integer ucenikId, Integer uciteljId, LocalDateTime datumVrijemePocetka) {
        this.ucenikId = ucenikId;
        this.uciteljId = uciteljId;
        this.datumVrijemePocetka = datumVrijemePocetka;
    }
}
