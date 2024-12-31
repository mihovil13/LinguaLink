package com.example.demo.controller;

import com.example.demo.config.JwtService;
import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.KorisnikServiceJPA;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import io.jsonwebtoken.Claims;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.config.RepositoryConfigurationSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/moj-profil")
public class KorisnikController {

    @Autowired
    private final KorisnikServiceJPA korisnikServiceJPA;
    private final JwtService jwtService;
    @Autowired
    private UciteljServiceJPA uciteljServiceJPA;
    @Autowired
    private UcenikServiceJPA ucenikServiceJPA;

    public KorisnikController(KorisnikServiceJPA korisnikServiceJPA, JwtService jwtService) {
        this.korisnikServiceJPA = korisnikServiceJPA;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<?> fetchData(@RequestHeader(value = "Authorization", required = false) String token,
                                       Authentication authentication) {

        if (token != null && token.startsWith("Bearer ")) {
            // Ako je korisnik autentificiran putem JWT tokena
            token = token.substring(7); // Ukloni "Bearer " prefix
            String email = jwtService.extractUsername(token);

            Optional<Korisnik> korisnik  = korisnikServiceJPA.getKorisnik(email);
            Korisnik korisnik1 = korisnikServiceJPA.getKorisnikByEmail(email);

            /*if(korisnik1.getUloga().equals("Učitelj")){
                Ucitelj ucitelj = uciteljServiceJPA.getUciteljiByEmail(email);
                System.out.println(ucitelj.getIskustvo());
                return ResponseEntity.status(HttpStatus.OK).body(ucitelj);
            }
            if(korisnik1.getUloga().equals("Učenik")){
                Ucenik ucenik = ucenikServiceJPA.getUcenik(email);
                return ResponseEntity.status(HttpStatus.OK).body(ucenik);
            }*/
            return korisnik.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
            //return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autentificiran.");
        }

    }

    @PutMapping
    public ResponseEntity<?> dopuniProfil(@RequestHeader(value = "Authorization", required = false) String token,
                                          Authentication authentication,@RequestBody Map<String, Object> body) {
        if (token.startsWith("Bearer ") && token != null) {
            token = token.substring(7);
            System.out.println(body);
            String email = jwtService.extractUsername(token);
            System.out.println(email);
            Korisnik korisnik = korisnikServiceJPA.getKorisnikByEmail(email);

            return korisnikServiceJPA.updateKorisnik(korisnik, body);


        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
