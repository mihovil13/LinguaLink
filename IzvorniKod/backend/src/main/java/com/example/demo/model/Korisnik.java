package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.lang.reflect.Array;
import java.util.Arrays;

@Entity
@Table(name = "Korisnici")
@Inheritance(strategy = InheritanceType.JOINED)

public class Korisnik {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private Integer user_id;
    @NotBlank (message = "Lozinka je obavezna")
    private String lozinka;
    @Email(message = "E-mail adresa nije u ispravnom formatu")
    private String email;
    private String ime;
    private String prezime;
    @Transient
    private String uloga;



    public Korisnik(@JsonProperty("ime") String username,
                    @JsonProperty("email") String email,
                    @JsonProperty("lozinka") String lozinka,
                    @JsonProperty("uloga") String uloga) {
        String[] parts = username.split(" ", 2);
        this.ime = parts[0];
        this.prezime = (parts.length > 1) ? parts[1] : "";
        this.lozinka = lozinka;
        this.email = email;
        this.uloga = uloga;
    }

    public Korisnik() {

    }

    public Korisnik(String username, String email, String lozinka) {
        String[] parts = username.split(" ", 2);
        this.ime = parts[0];
        this.prezime = (parts.length > 1) ? parts[1] : "";
        this.lozinka = lozinka;
        this.email = email;
    }

    public String getUloga() {
        return uloga;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }
    public Integer getUser_id() {
        return user_id;
    }

    public String getIme() {
        return ime;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public String getLozinka() {
        return lozinka;
    }

    public String getEmail() {
        return email;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}