package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "Korisnici")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)

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
    private String lozinka;
    private String email;

    public Korisnik(@JsonProperty("email") String email, @JsonProperty("lozinka") String lozinka) {
        this.lozinka = lozinka;
        this.email = email;
    }

    public Korisnik() {

    }

    public Integer getUser_id() {
        return user_id;
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