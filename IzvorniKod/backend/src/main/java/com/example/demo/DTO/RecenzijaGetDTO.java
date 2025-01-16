package com.example.demo.DTO;

import com.example.demo.model.Recenzija;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecenzijaGetDTO {
    private String ime;
    private String prezime;
    private String komentar;
    private Integer ocjena;
    //private Recenzija recenzija;

    public RecenzijaGetDTO() {
    }
}
