# LinguaLink

> Cilj našeg projekta je stvoriti pristupačnu i jednostavnu za korištenje platformu koja će pomoći korisnicima u učenju novog jezika.
> Aplikacija će omogućiti učenicima jezika pretragu, a zatim i spajanje s učiteljima koji će ih voditi kroz učenje jezika.


# Funkcijski zahtjevi:
> uvid svih dostupnih učitelja i njihovih rasporeda dostupan je bez registracije
> za sve ostale funkcionalnosti, korisnik se treba registrirati/prijaviti u sustav
> registracija: bilo tko, unese osnovne podatke i može birati je li učitelj ili učenik
> adresa mora biti važeća (e-mail) -> autorizacija: OAuth 2.0 protokol koristeći tokene
  
UČITELJ:
> mora dodati podatke: koje jezike podučava, iskustvo, kvalifikacije, stil podučavanja, slika profila i satnica
> mora se dodati funkcionalnost kalendara u kojem će si učitelji postaviti termine u kojima su slobodni za podučavanje --> za integraciju kalendara koristimo postojeća rješenja

UČENIK:
> koje jezike želi učiti, svoju trenutnu razinu znanja [početna, srednja, napredna], preferirani stil podučavanja
> mogu postaviti ciljeve učenja (npr. putovanje, poslovna komunikacija, priprema za ispit etc.)

PRETRAGA:
> kad učenik pretražuje --> prvo se prikazuju učitelji po preferencijama svog profila
> učenik može regulirati pretragu mijenjajući filtere pretrage --> nije ograničen na preference koje je postavio na svom profilu

KATEGORIJE FILTRIRANJA: jezici, kvalifikacije, stil podučavanja, satnica i kalendar dostupnosti

PRONAŠLI SU SE UČITELJ I UČENIK:

UČENIK: bira datum i vrijeme i šalje ZAHTJEV

UČITELJ: svaki zahtjev može prihvatiti ili odbiti
> učitelj je obaviješten o svakom zahtjevu za lekcijom, a učenik o svakom prihvaćanju zahtjeva [UČENIK NE DOBIVA OBAVIJEST AKO NIJE PRIHVAĆENO??]
> nakon uspješnog dogovora, sastanak je evidentiran u kalendaru i otvara se mogućnost CHATa između učitelja i učenika
> u chatu se mogu dogovoriti preko koje platforme će se održati lekcija, razmjena brojeva, načini plaćanja
> za implementaciju chata: FreeChat

KOMENTARI I RECENZIJE
> ako učenik ima odrađenu BAREM jednu lekciju s određenim učiteljom, otvara se mogućnost ostavljanja komentara i ocjene na profilu učitelja
> odrađene lekcije se ARHIVIRAJU, ne brišu! --> svaki korisnik ima uvid u svoje prijašnje lekcije (i učenik i učitelj)
> na profilu učitelja prikazuje se BROJ učenika koje je podučavao i broj lekcija koje je održao
> platformu održavaju sistemski administratori koji mogu upravljati korisnicima, uređivati i brisati profile

OSTALI ZAHTJEVI
> aplikacija treba biti izvedena kao web aplikacija prilagođena mobilnom uređaju kojoj će registrirani korisnici pristupati uz pomoć korisničkog imena i lozinke
> sustav treba podržati više korisnika u stvarnom vremenu

# Tehnologije
> React
> 
> Spring
> 
> PostgreSQL


# Članovi tima 
> Popis članova tima/linkovi/ glavni doprinos
> 
> Dario Jurgec / djurgec
> 
> Mihovil Mađerić / mihovil13
> 
> Zita Martinović / zita-m
> 
> Adi Stajku / asttajku
> 
> Borna Svjetličić / borna21
> 
> Adam Šinjori / aSinjori
> 
> Mia Zekić / miazze

# Kontribucije
>Pravila ovise o organizaciji tima i su često izdvojena u CONTRIBUTING.md



# 📝 Kodeks ponašanja [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)
Kao studenti sigurno ste upoznati s minimumom prihvatljivog ponašanja definiran u [KODEKS PONAŠANJA STUDENATA FAKULTETA ELEKTROTEHNIKE I RAČUNARSTVA SVEUČILIŠTA U ZAGREBU](https://www.fer.hr/_download/repository/Kodeks_ponasanja_studenata_FER-a_procisceni_tekst_2016%5B1%5D.pdf), te dodatnim naputcima za timski rad na predmetu [Programsko inženjerstvo](https://wwww.fer.hr).
Očekujemo da ćete poštovati [etički kodeks IEEE-a](https://www.ieee.org/about/corporate/governance/p7-8.html) koji ima važnu obrazovnu funkciju sa svrhom postavljanja najviših standarda integriteta, odgovornog ponašanja i etičkog ponašanja u profesionalnim aktivnosti. Time profesionalna zajednica programskih inženjera definira opća načela koja definiranju  moralni karakter, donošenje važnih poslovnih odluka i uspostavljanje jasnih moralnih očekivanja za sve pripadnike zajenice.

Kodeks ponašanja skup je provedivih pravila koja služe za jasnu komunikaciju očekivanja i zahtjeva za rad zajednice/tima. Njime se jasno definiraju obaveze, prava, neprihvatljiva ponašanja te  odgovarajuće posljedice (za razliku od etičkog kodeksa). U ovom repozitoriju dan je jedan od široko prihvačenih kodeks ponašanja za rad u zajednici otvorenog koda.
>### Poboljšajte funkcioniranje tima:
>* definirajte načina na koji će rad biti podijeljen među članovima grupe
>* dogovorite kako će grupa međusobno komunicirati.
>* ne gubite vrijeme na dogovore na koji će grupa rješavati sporove primjenite standarde!
>* implicitno podrazmijevamo da će svi članovi grupe slijediti kodeks ponašanja.
 
>###  Prijava problema
>Najgore što se može dogoditi je da netko šuti kad postoje problemi. Postoji nekoliko stvari koje možete učiniti kako biste najbolje riješili sukobe i probleme:
>* Obratite mi se izravno [e-pošta](mailto:vlado.sruk@fer.hr) i  učinit ćemo sve što je u našoj moći da u punom povjerenju saznamo koje korake trebamo poduzeti kako bismo riješili problem.
>* Razgovarajte s vašim asistentom jer ima najbolji uvid u dinamiku tima. Zajedno ćete saznati kako riješiti sukob i kako izbjeći daljnje utjecanje u vašem radu.
>* Ako se osjećate ugodno neposredno razgovarajte o problemu. Manje incidente trebalo bi rješavati izravno. Odvojite vrijeme i privatno razgovarajte s pogođenim članom tima te vjerujte u iskrenost.

# 📝 Licenca
Važeča (1)
[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

Ovaj repozitorij sadrži otvoreni obrazovni sadržaji (eng. Open Educational Resources)  i licenciran je prema pravilima Creative Commons licencije koja omogućava da preuzmete djelo, podijelite ga s drugima uz 
uvjet da navođenja autora, ne upotrebljavate ga u komercijalne svrhe te dijelite pod istim uvjetima [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License HR][cc-by-nc-sa].
>
> ### Napomena:
>
> Svi paketi distribuiraju se pod vlastitim licencama.
> Svi upotrijebleni materijali  (slike, modeli, animacije, ...) distribuiraju se pod vlastitim licencama.

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: https://creativecommons.org/licenses/by-nc/4.0/deed.hr 
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg

Orginal [![cc0-1.0][cc0-1.0-shield]][cc0-1.0]
>
>COPYING: All the content within this repository is dedicated to the public domain under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication.
>
[![CC0-1.0][cc0-1.0-image]][cc0-1.0]

[cc0-1.0]: https://creativecommons.org/licenses/by/1.0/deed.en
[cc0-1.0-image]: https://licensebuttons.net/l/by/1.0/88x31.png
[cc0-1.0-shield]: https://img.shields.io/badge/License-CC0--1.0-lightgrey.svg

### Reference na licenciranje repozitorija
