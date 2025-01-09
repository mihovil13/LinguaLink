package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@AllArgsConstructor
@Table(name="ucitelji")
public class Ucitelj extends Korisnik {


    @Enumerated(EnumType.STRING)
    private Role role;

    private String iskustvo;
    //private String qualifications;
    private String satnica;
    //private String languagesTeach;
    private String stilPoducavanja;

    @ManyToMany
    @JoinTable(
            name = "UciteljJezik",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "jezik_id")
    )
    @JsonManagedReference
    private List<Jezik> languagesTeach = new ArrayList<>();

    @ElementCollection(targetClass = Qualifications.class)
    @CollectionTable(name = "teacher_qualifications", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING) // Store the enum as a string in the database
    private Set<Qualifications> qualifications = new HashSet<>();


    public Ucitelj(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    public Ucitelj(String ime, String prezime, String email, String lozinka, String uloga) {
        super(ime, prezime, email, lozinka, uloga);
    }

    public Ucitelj() {

    }

    public Set<Qualifications> getQualifications() {
        return qualifications;
    }

    public void setQualifications(Set<Qualifications> qualifications) {
        this.qualifications = qualifications;
    }

    /*
        public List<Jezik> getJezici2() {
            return jezici2;
        }

        public void setJezici2(List<Jezik> jezici2) {
            this.jezici2 = jezici2;
        }
    */
    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
    }
/*
    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }
*/
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

    public List<Jezik> getLanguagesTeach() {
        return languagesTeach;
    }

    public void setLanguagesTeach(List<Jezik> languagesTeach) {
        this.languagesTeach = languagesTeach;
    }
    public Integer getId(){
        return super.getUser_id();
    }


    /* public void setLanguagesTeach(String languagesTeach) {
        this.languagesTeach = languagesTeach;
    }
    public void setLanguagesTeach(List<Map<String, String>> languages) {
        this.languagesTeach = languages.stream()
                .map(lang -> (String) lang.get("language"))
                .collect(Collectors.joining(", "));
    }

    */
}
//    public Ucitelj(String ime, String prezime, String email, String lozinka) {
//        super(ime, prezime, email, lozinka);
//    }
//
//    public Long getUcitelj_id() {
//        return ucitelj_id;
//    }
//
//    public Integer getGodine_iskustva() {
//        return godine_iskustva;
//    }
//
//    public void setGodine_iskustva(Integer godine_iskustva) {
//        this.godine_iskustva = godine_iskustva;
//    }
//
//    public String getKvalifikacije() {
//        return kvalifikacije;
//    }
//
//    public void setKvalifikacije(String kvalifikacije) {
//        this.kvalifikacije = kvalifikacije;
//    }
//
//    public String getSatnica() {
//        return satnica;
//    }
//
//    public void setSatnica(String satnica) {
//        this.satnica = satnica;
//    }
//}
//```