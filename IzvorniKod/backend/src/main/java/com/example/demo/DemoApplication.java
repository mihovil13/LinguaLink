package com.example.demo;

import com.example.demo.model.Korisnik;
import com.example.demo.model.Ucitelj;
import com.example.demo.repository.JezikRepository;
import com.example.demo.repository.KorisnikRepository;
import com.example.demo.config.ApplicationConfig;
import com.example.demo.repository.UciteljRepository;
import com.example.demo.service.JezikServiceJPA;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner comanndLineRunner(KorisnikRepository repository, JezikServiceJPA jezikServiceJPA, PasswordEncoder passwordEncoder, UciteljRepository uciteljRepository){
		return args -> {
			//add some data
			jezikServiceJPA.saveLanguages();
			uciteljRepository.save(new Ucitelj("Ivica", "Maric","ivica.maric@gmail.com", passwordEncoder.encode("pass123"),"Učitelj"));
			uciteljRepository.save(new Ucitelj("Perica",  "Peric","perica.peric@gmail.com", passwordEncoder.encode("nogomet123"),"Učitelj"));
			repository.save(new Korisnik("Ana",  "Katic","ana.katic@gmail.com", passwordEncoder.encode("volimpse123"),"Učenik"));
			repository.save(new Korisnik("Nedjeljko", "Bajic","nedjeljko.bajic@gmail.com", passwordEncoder.encode("progi<3"),"Učenik"));
			repository.save(new Korisnik("Ivan", "Horvat", "ivan.horvat@gmail.com",  passwordEncoder.encode("ovojeadminsifra"), "Admin"));
		};
	}

}
