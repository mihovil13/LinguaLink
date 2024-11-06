package com.example.demo.users;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Korisnik {
    private Integer user_id;
    private String ime;
    private String prezime;
    private String lozinka;
    private String email;

    public Korisnik(@JsonProperty("ime") String ime,@JsonProperty("prezime") String prezime, @JsonProperty("password") String lozinka,@JsonProperty("email") String email) {
        this.ime = ime;
        this.prezime = prezime;
        this.lozinka = lozinka;
        this.email = email;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public String getIme() {
        return ime;
    }

    public String getPrezime() {
        return prezime;
    }

    public String getLozinka() {
        return lozinka;
    }

    public String getEmail() {
        return email;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public void setPrezime(String prezime) {
        this.prezime = prezime;
    }

    public void setLozinka(String lozinka) {
        this.lozinka = lozinka;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
