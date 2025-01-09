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
    @Column(name = "predavanje_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer predavanjeId;

    @ManyToOne
    @JoinColumn(name = "ucenik_id", referencedColumnName = "user_id", nullable = false)
    private Ucenik ucenik;

    @ManyToOne
    @JoinColumn(name = "ucitelj_id", referencedColumnName = "user_id", nullable = false)
    private Ucitelj ucitelj;

    @Column(name = "datum_vrijeme_pocetka", nullable = false)
    private LocalDateTime datumVrijemePocetka;

    public Predavanje() {
        // Default constructor
    }

    public Predavanje(Ucenik ucenik, Ucitelj ucitelj, LocalDateTime datumVrijemePocetka) {
        this.ucenik = ucenik;
        this.ucitelj = ucitelj;
        this.datumVrijemePocetka = datumVrijemePocetka;
    }
}
