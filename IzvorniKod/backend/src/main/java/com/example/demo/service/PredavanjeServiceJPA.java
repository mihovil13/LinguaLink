package com.example.demo.service;

import com.example.demo.DTO.PredavanjeDTO;
import com.example.demo.model.Predavanje;
import com.example.demo.repository.PredavanjeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PredavanjeServiceJPA implements PredavanjeService {

    private final PredavanjeRepository predavanjeRepository;

    @Autowired
    public PredavanjeServiceJPA(PredavanjeRepository predavanjeRepository) {
        this.predavanjeRepository = predavanjeRepository;
    }

    @Override
    public void savePredavanje(Predavanje predavanje) {
        if (predavanje.getPotvrdeno() == null) {
            predavanje.setPotvrdeno(0);
        }
        predavanjeRepository.save(predavanje);
    }

    @Override
    public List<PredavanjeDTO> getPredavanjaByUciteljId(int uciteljId) {
        return predavanjeRepository.findByUciteljId(uciteljId)
                .stream()
                .map(predavanje -> {
                    PredavanjeDTO dto = new PredavanjeDTO();
                    dto.setPredavanjeId(predavanje.getPredavanjeId());
                    dto.setUcenikId(predavanje.getUcenikId());
                    dto.setUciteljId(predavanje.getUciteljId());
                    dto.setDatumVrijemePocetka(predavanje.getDatumVrijemePocetka());
                    dto.setPotvrdeno(predavanje.getPotvrdeno()); // Dodano
                    dto.setUcenikIme(predavanje.getUcenik().getIme());
                    dto.setUcenikPrezime(predavanje.getUcenik().getPrezime());
                    dto.setUciteljIme(predavanje.getUcitelj().getIme());
                    dto.setUciteljPrezime(predavanje.getUcitelj().getPrezime());
                    return dto;
                })
                .toList();
    }

    @Override
    public void updatePotvrdeno(Integer predavanjeId, Integer potvrdeno) {
        Predavanje predavanje = predavanjeRepository.findById(predavanjeId)
                .orElseThrow(() -> new IllegalArgumentException("Predavanje s ID " + predavanjeId + " ne postoji."));
        predavanje.setPotvrdeno(potvrdeno);
        predavanjeRepository.save(predavanje);
    }

    @Override
    public List<PredavanjeDTO> getPredavanjaByUcenikId(int ucenikId) {
        return predavanjeRepository.findByUcenikId(ucenikId)
                .stream()
                .map(predavanje -> {
                    PredavanjeDTO dto = new PredavanjeDTO();
                    dto.setPredavanjeId(predavanje.getPredavanjeId());
                    dto.setUcenikId(predavanje.getUcenikId());
                    dto.setUciteljId(predavanje.getUciteljId());
                    dto.setDatumVrijemePocetka(predavanje.getDatumVrijemePocetka());
                    dto.setPotvrdeno(predavanje.getPotvrdeno()); // Dodano
                    dto.setUcenikIme(predavanje.getUcenik().getIme());
                    dto.setUcenikPrezime(predavanje.getUcenik().getPrezime());
                    dto.setUciteljIme(predavanje.getUcitelj().getIme());
                    dto.setUciteljPrezime(predavanje.getUcitelj().getPrezime());
                    return dto;
                })
                .toList();
    }


}
