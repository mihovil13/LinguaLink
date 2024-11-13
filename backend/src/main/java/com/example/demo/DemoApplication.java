package com.example.demo;

import com.example.demo.model.Korisnik;
import com.example.demo.repository.KorisnikRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner comanndLineRunner(KorisnikRepository repository){
		return args -> {
			//add some data
			repository.save(new Korisnik("Ivica", "Maric","ivica.maric@gmail.com", "pass123","Učenik"));
			repository.save(new Korisnik("Perica",  "Peric","perica.peric@gmail.com", "nogomet123","Učitelj"));
			repository.save(new Korisnik("Ana",  "Katic","ana.katic@gmail.com", "volimpse123","Učenik"));
			repository.save(new Korisnik("Nedjeljko", "Bajic","nedjeljko.bajic@gmail.com", "progi<3","Učenik"));
		};
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**").allowedOrigins("http://localhost:3000");
			}
		};
	}

}
