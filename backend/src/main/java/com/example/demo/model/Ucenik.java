package com.example.demo.model;

import jakarta.persistence.*;

@Entity

public class Ucenik extends Korisnik{

    @Column(name = "ucenik_id")
    private Long ucenik_id;

    public Ucenik(String username, String email, String lozinka) {
        super(username, email, lozinka);
        setUloga("Učenik");
    }

    public Ucenik() {

    }

    @Override
    public String toString() {
        return "Ucenik{}"+super.toString();
    }
    public Long getUcenik_id() {
        return ucenik_id;
    }
}
