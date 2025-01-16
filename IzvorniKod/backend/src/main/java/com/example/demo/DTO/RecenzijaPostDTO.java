package com.example.demo.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor

public class RecenzijaPostDTO {
    private Long ucenikId;
    private Long uciteljId;
    private Integer predavanjeId;
    private Integer ocjena;
    private String komentar;

}
