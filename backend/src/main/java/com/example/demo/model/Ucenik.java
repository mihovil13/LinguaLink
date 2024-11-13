package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;

@Entity
@AllArgsConstructor
public class Ucenik extends Korisnik{
    @Column(name = "ucenik_id")
    private Long ucenik_id;
    @Enumerated(EnumType.STRING)
    private Role role;

    public Ucenik(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    public Ucenik() {

    }

}

//    @Override
//    public String toString() {
//        return "Ucenik{}"+super.toString();
//    }
//    public Long getUcenik_id() {
//        return ucenik_id;
//    }
//}
//