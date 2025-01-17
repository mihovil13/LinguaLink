package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Entity
@Builder
@Table(name = "Korisnici")
@Inheritance(strategy = InheritanceType.JOINED)
@AllArgsConstructor
public class Korisnik implements UserDetails {
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
    private String uloga;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Lob
    @Column(name = "profilePicture", columnDefinition = "TEXT")
    private String profilePicture;

    public Korisnik(@JsonProperty("ime") String ime,
                    @JsonProperty("prezime") String prezime,
                    @JsonProperty("email") String email,
                    @JsonProperty("lozinka") String lozinka,
                    @JsonProperty("uloga") String uloga) {
        this.ime = ime;
        this.prezime = prezime;
        this.lozinka = lozinka;
        this.email = email;
        this.uloga = uloga;
    }

    public Korisnik() {

    }
    public Korisnik(String ime,String prezime,String email){
        this.ime = ime;
        this.prezime = prezime;
        this.email = email;
    }

    public Korisnik(String ime, String prezime, String email, String lozinka) {
        this.ime = ime;
        this.prezime = prezime;
        this.lozinka = lozinka;
        this.email = email;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getPassword() {
        return getLozinka();
    }

    @Override
    public String getUsername() {
        return getEmail();
    }


    public Object getRole() {return role;}
}