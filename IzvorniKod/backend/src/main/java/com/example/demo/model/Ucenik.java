//package com.example.demo.model;
//
//import jakarta.persistence.*;
//
//@Entity
//
//public class Ucenik extends Korisnik{
//
//    @Column(name = "ucenik_id")
//    private Long ucenik_id;
//
//    public Ucenik(String ime, String prezime, String email, String lozinka, Long ucenik_id) {
//        super(ime, prezime, email, lozinka);
//        this.ucenik_id = ucenik_id;
//    }
//
//    public Ucenik() {
//
//    }
//
//    @Override
//    public String toString() {
//        return "Ucenik{}"+super.toString();
//    }
//    public Long getUcenik_id() {
//        return ucenik_id;
//    }
//}
//