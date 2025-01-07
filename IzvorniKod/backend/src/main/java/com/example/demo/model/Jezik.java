package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@AllArgsConstructor
@Table(name="jezici")
public class Jezik {
    @Id
    @Column(name = "jezikId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer jezikId;

    private String nazivJezika;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
    @JsonIgnore
    @ManyToMany(mappedBy = "jezici")
    private List<Ucenik> ucenikList = new ArrayList<>();

    @JsonIgnore
    @ManyToMany(mappedBy = "jezici2")
    private List<Ucitelj> uciteljList = new ArrayList<>();


    @OneToMany(mappedBy = "jezik",cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<JezikRazina> jeziciRazine = new ArrayList<>();

>>>>>>> Stashed changes
    public Jezik() {

    }

    public Integer getLanguageId() {
        return jezikId;
    }

    public void setLanguageId(Integer jezikId) {
        this.jezikId = jezikId;
    }

    public String getNazivJezika() {
        return nazivJezika;
    }

    public void setNazivJezika(String nazivJezika) {
        this.nazivJezika = nazivJezika;
    }
}