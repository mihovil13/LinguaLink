package com.example.demo.controller;

import com.example.demo.DTO.KorisnikGetDTO;
import com.example.demo.config.JwtService;
import com.example.demo.mapper.KorisnikGetMapper;
import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.service.KorisnikServiceJPA;
import com.example.demo.service.UcenikServiceJPA;
import com.example.demo.service.UciteljServiceJPA;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.config.RepositoryConfigurationSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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
            KorisnikGetMapper mapper = new KorisnikGetMapper(ucenikServiceJPA,uciteljServiceJPA);
            KorisnikGetDTO korisnikGetDTO = mapper.korisnikGetDTO(korisnik1);
            return ResponseEntity.ok(korisnikGetDTO);
            /*return korisnik.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
            //return ResponseEntity.status(HttpStatus.NOT_FOUND).build();*/
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autentificiran.");
        }

    }

    @PutMapping
    public ResponseEntity<?> dopuniProfil(@RequestHeader(value = "Authorization", required = false) String token,
                                          Authentication authentication,@RequestBody @Valid Map<String, Object> body) {
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

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestHeader(value = "Authorization", required = false) String token,
                                                @RequestParam("profileImage") MultipartFile file) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            String email = jwtService.extractUsername(token);
            Korisnik korisnik = korisnikServiceJPA.getKorisnikByEmail(email);

            try {
                // Validacija fajla
                if (file.isEmpty()) {
                    return ResponseEntity.badRequest().body("Fajl nije priložen.");
                }

                // Kreiraj direktorijum ako ne postoji
                File uploadDir = new File("uploads/");
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Generiši jedinstveno ime fajla i sačuvaj ga
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename(); // Izbegni konflikte imena
                String filePath = uploadDir + File.separator + fileName;
                file.transferTo(new File(filePath));

                // Postavi URL slike u korisnikov profil
                korisnik.setProfileImageUrl("/uploads/" + fileName);
                korisnikServiceJPA.save(korisnik);

                return ResponseEntity.ok(Map.of("imageUrl", korisnik.getProfileImageUrl()));
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Greška prilikom upload-a slike.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Korisnik nije autentifikovan.");
        }
    }



}
