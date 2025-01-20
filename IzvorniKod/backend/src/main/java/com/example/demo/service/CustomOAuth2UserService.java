package com.example.demo.service;

import com.example.demo.model.Korisnik;
import com.example.demo.model.Role;
import com.example.demo.model.Ucenik;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.repository.UcenikRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;

import java.util.Collections;
import java.util.Optional;

@Component
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private KorisnikRepository korisnikRepository;

    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    @Autowired
    private UcenikRepository ucenikRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        // Extract user details
        String email = (String) oAuth2User.getAttributes().get("email");
        String fullname = (String) oAuth2User.getAttributes().get("name");

        // Check if user already exists
        Optional<Korisnik> existingUser = korisnikRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // User already exists, proceed to login
            Korisnik user = existingUser.get();
            // Return the existing user with the authorities
            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                    oAuth2User.getAttributes(),
                    "email"
            );
        }

        // If user does not exist, create a new user
        var newUser = Korisnik.builder()
                .ime(fullname.split(" ")[0])
                .prezime(fullname.split(" ")[1])
                .email(email)
                .uloga(null)
                .lozinka("default_lozinka_za_oauth2") // Note: Consider a more secure password handling method
                .role(Role.ROLE_USER)
                .build();

        // Save the new user to the database
        korisnikRepository.save(newUser);
        //Ucenik ucenik = new Ucenik(newUser.getIme(),newUser.getPrezime(),newUser.getEmail(),newUser.getLozinka(), newUser.getUloga());
        //ucenikRepository.save(ucenik);


        // Return the new user with the authorities
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                oAuth2User.getAttributes(),
                "email"
        );
    }
}
