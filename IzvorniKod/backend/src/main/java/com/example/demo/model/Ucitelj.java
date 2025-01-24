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

    private String satnica;

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


    @OneToMany(mappedBy = "ucitelj",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Recenzija> recenzija2 = new ArrayList<>();

    public Ucitelj(String ime, String prezime, String email, String lozinka) {
        super(ime, prezime, email, lozinka);
    }

    public Ucitelj(String ime, String prezime, String email, String lozinka, String uloga, Role role) {
        super(ime, prezime, email, lozinka, uloga, role);
    }

    public Ucitelj() {

    }

    public Set<Qualifications> getQualifications() {
        return qualifications;
    }

    public void setQualifications(Set<Qualifications> qualifications) {
        this.qualifications = qualifications;
    }


    public String getIskustvo() {
        return iskustvo;
    }

    public void setIskustvo(String iskustvo) {
        this.iskustvo = iskustvo;
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

    public List<Jezik> getLanguagesTeach() {
        return languagesTeach;
    }

    public void setLanguagesTeach(List<Jezik> languagesTeach) {
        this.languagesTeach = languagesTeach;
    }
    public Integer getId(){
        return super.getUser_id();
    }


    public List<Recenzija> getRecenzija2() {
        return recenzija2;
    }

    public void setRecenzija2(List<Recenzija> recenzija2) {
        this.recenzija2 = recenzija2;
    }

    public byte[] getSlika() {
        return super.getSlika();
    }

}
