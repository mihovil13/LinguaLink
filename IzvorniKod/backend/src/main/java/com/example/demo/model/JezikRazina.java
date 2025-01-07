package com.example.demo.model;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
=======
=======
>>>>>>> Stashed changes
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
>>>>>>> Stashed changes

@Embeddable
public class JezikRazina {
    private Integer jezik_id;
    private Razina razina;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    public JezikRazina(Jezik jezik, Razina razina) {
        this.jezik_id = jezik_id;
        this.razina = razina;
    }
=======
=======
>>>>>>> Stashed changes
    @ManyToOne
    @JsonBackReference
    private Jezik jezik;


    public JezikRazina(Razina razina, Jezik jezik) {
        this.razina = razina;
        this.jezik = jezik;
    }

    @ManyToOne
    @JsonBackReference
    private Ucenik ucenik;
>>>>>>> Stashed changes

    public JezikRazina() {

    }

    public Integer getJezikID() { return jezik_id;}

    public Razina getRazina() { return razina;}

    public void setJezik(Integer jezik_id) {
        this.jezik_id = jezik_id;
    }

    public void setRazina(Razina razina) {
        this.razina = razina;
    }
}
