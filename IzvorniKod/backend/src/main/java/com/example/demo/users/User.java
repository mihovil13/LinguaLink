package com.example.demo.users;

public class User {
    private Integer user_id;
    private String ime;
    private String prezime;
    private String lozinka;
    private String email;

    public User(String ime, String prezime, String lozinka, String email) {
        this.ime = ime;
        this.prezime = prezime;
        this.lozinka = lozinka;
        this.email = email;
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

    @Override
    public String toString() {
        return "User{" +
                "user_id=" + user_id +
                ", ime='" + ime + '\'' +
                ", prezime='" + prezime + '\'' +
                ", lozinka='" + lozinka + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
