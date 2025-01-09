package com.example.demo.DTO;

import com.example.demo.model.Jezik;
import com.example.demo.model.JezikRazina;

import java.util.List;

public class KorisnikGetDTO {
    private Integer id;
    private String ime;
    private String prezime;
    private String uloga;
    private String email;
    private List<String> languagesKnown;
    private List<Jezik> languagesToLearn;
    private List<Jezik> languagesTeach;
    private String iskustvo;
    private List<String> qualifications;
    private String satnica;
    //private String languagesTeach;
    private String stilPoducavanja;
    private String ciljeviUcenja;

    public KorisnikGetDTO(Integer id, String ime, String prezime,String email, List<Jezik> languagesTeach, List<Jezik> languagesToLearn, List<String> languagesKnown, String uloga) {
        this.id = id;
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
        this.languagesTeach = languagesTeach;
        this.languagesToLearn = languagesToLearn;
        this.languagesKnown = languagesKnown;
        this.uloga = uloga;
    }

    public KorisnikGetDTO(String ime, String uloga, String prezime) {
        this.ime = ime;
        this.uloga = uloga;
        this.prezime = prezime;
    }
    public KorisnikGetDTO() {

    }

    public String getCiljeviUcenja() {
        return ciljeviUcenja;
    }

    public void setCiljeviUcenja(String ciljeviUcenja) {
        this.ciljeviUcenja = ciljeviUcenja;
    }

    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
    }

    public List<String> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<String> qualifications) {
        this.qualifications = qualifications;
    }

    public String getSatnica() {
        return satnica;
    }

    public void setSatnica(String satnica) {
        this.satnica = satnica;
    }

    public String getStilPoducavanja() {
        return stilPoducavanja;
    }

    public void setStilPoducavanja(String stilPoducavanja) {
        this.stilPoducavanja = stilPoducavanja;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getLanguagesKnown() {
        return languagesKnown;
    }

    public void setLanguagesKnown(List<String> languagesKnown) {
        this.languagesKnown = languagesKnown;
    }

    public List<Jezik> getLanguagesToLearn() {
        return languagesToLearn;
    }

    public void setLanguagesToLearn(List<Jezik> languagesToLearn) {
        this.languagesToLearn = languagesToLearn;
    }

    public List<Jezik> getLanguagesTeach() {
        return languagesTeach;
    }

    public void setLanguagesTeach(List<Jezik> languagesTeach) {
        this.languagesTeach = languagesTeach;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getUloga() {
        return uloga;
    }

    public void setUloga(String uloga) {
        this.uloga = uloga;
    }

}
