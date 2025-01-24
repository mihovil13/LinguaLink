import com.example.demo.DemoApplication;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.service.KorisnikServiceJPA;
import jakarta.validation.constraints.AssertTrue;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.internal.verification.VerificationModeFactory.times;


@Transactional
@SpringBootTest(classes = DemoApplication.class)
public class Test1{

    @Autowired
    private KorisnikRepository korisnikRepository;
    @Autowired
    private KorisnikServiceJPA korisnikServiceJPA;
    @Autowired
    private PredavanjeRepository predavanjeRepository;
    @Autowired
    private UcenikRepository ucenikRepository;
    @Autowired
    private UciteljRepository uciteljRepository;
    @Autowired
    private RecenzijaRepository recenzijaRepository;

    @Test
    public void testGetByEmail() {
        String email = "ana.horvat@gmail.com";
        Korisnik korisnik = new Korisnik();
        korisnik.setEmail(email);
        korisnik.setIme("Ana");
        korisnik.setPrezime("Horvat");
        korisnik.setLozinka("proba");
        korisnik.setUloga("Učenik");

        korisnikRepository.save(korisnik);

        Optional <Korisnik> savedKorisnik  = korisnikRepository.findByEmail(email);
        Assertions.assertTrue(savedKorisnik.isPresent());
        Assertions.assertEquals(email, savedKorisnik.get().getEmail());
    }

    @Test
    public void testDeleteById() {
        Korisnik korisnik = new Korisnik();
        korisnik.setEmail("ana_h@gmail.com");
        korisnik.setIme("Ana");
        korisnik.setPrezime("Horvat");
        korisnik.setLozinka("password");
        korisnik.setUloga("Učenik");

        Korisnik savedKorisnik = korisnikRepository.save(korisnik);
        Integer id = savedKorisnik.getUser_id();

        korisnikRepository.deleteById(Long.valueOf(id));
        Assertions.assertFalse(korisnikRepository.findById(Long.valueOf(id)).isPresent());
    }

    @Test
    public void testSaveUser() {
        Korisnik korisnik = new Korisnik();
        korisnik.setEmail("anah2@gmail.com");
        korisnik.setIme("Ana");
        korisnik.setPrezime("Horvat");
        korisnik.setLozinka("123456");
        korisnik.setUloga("Učenik");

        Korisnik savedKorisnik = korisnikRepository.save(korisnik);

        Assertions.assertNotNull(savedKorisnik);
        Assertions.assertEquals("anah2@gmail.com", savedKorisnik.getEmail());
    }

    @Test
    public void testRegisterFail() {
        Korisnik korisnik = new Korisnik();
        korisnik.setEmail("ivica.maric@gmail.com");
        korisnik.setIme("Ivica");
        korisnik.setPrezime("Maric");
        korisnik.setLozinka("123456");
        korisnik.setUloga("Učitelj");

        assertThrows(IllegalArgumentException.class, () -> {
            korisnikServiceJPA.register(korisnik);
        });
    }

    @Test
    public void testAddPredavanje() {
        Ucenik ucenik=ucenikRepository.save(new Ucenik("Ana",  "Horvat","anah123@gmail.com", "123","Učenik",Role.ROLE_USER));
        Ucitelj ucitelj=uciteljRepository.save(new Ucitelj("Ivan",  "Horvat","ivanh@gmail.com", "123","Učitelj",Role.ROLE_USER));

        Predavanje predavanje= new Predavanje();
        predavanje.setUcenikId(ucenik.getId());
        predavanje.setUciteljId(ucitelj.getId());
        predavanje.setDatumVrijemePocetka(LocalDateTime.now());

        Predavanje saved= predavanjeRepository.save(predavanje);
        Assertions.assertNotNull(saved);
        Assertions.assertEquals(ucenik.getId(), saved.getUcenikId());
    }

    @Test
    public void testAddRecenzija() {
        Ucenik ucenik=ucenikRepository.save(new Ucenik("Ana",  "Horvat","anah123@gmail.com", "123","Učenik",Role.ROLE_USER));
        Ucitelj ucitelj=uciteljRepository.save(new Ucitelj("Ivan",  "Horvat","ivanh@gmail.com", "123","Učitelj",Role.ROLE_USER));

        Recenzija recenzija=new Recenzija(5, "super");
        recenzija.setUcenik(ucenik);
        recenzija.setUcitelj(ucitelj);

        Recenzija saved= recenzijaRepository.save(recenzija);
        Assertions.assertNotNull(saved);
        Assertions.assertEquals("super", saved.getKomentar());
    }

    @Test
    public void testDeleteUser_NotImplemented() {
        Korisnik korisnik = new Korisnik();
        korisnik.setEmail("korisnik.za.brisanje@gmail.com");
        korisnik.setIme("Korisnik");
        korisnik.setPrezime("Za Brisanje");
        korisnikRepository.save(korisnik);
        assertThrows(UnsupportedOperationException.class, () -> {
            korisnikServiceJPA.deleteUser(korisnik);
        });

    }
}
