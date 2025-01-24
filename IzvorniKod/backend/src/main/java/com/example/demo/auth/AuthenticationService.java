package com.example.demo.auth;

import com.example.demo.model.Ucenik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.config.JwtService;
import com.example.demo.model.Role;
import com.example.demo.model.Korisnik;
import com.example.demo.repository.UcenikRepository;
import com.example.demo.repository.UciteljRepository;
import com.example.demo.service.KorisnikServiceJPA;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final KorisnikRepository repository;
    private final UcenikRepository ucenikRepository;
    private final UciteljRepository uciteljRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final KorisnikServiceJPA korisnikServiceJPA;
    public AuthenticationResponse register(RegisterRequest request) {
        var user = Korisnik.builder()
                .ime(request.getIme())
                .prezime(request.getPrezime())
                .email(request.getEmail())
                .uloga(request.getUloga())
                .lozinka(passwordEncoder.encode(request.getLozinka()))
                .role(Role.ROLE_USER)
                .build();

        korisnikServiceJPA.register(user);

        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getLozinka()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

}
