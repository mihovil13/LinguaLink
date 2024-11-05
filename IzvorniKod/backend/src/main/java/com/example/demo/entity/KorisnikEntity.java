package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigInteger;

@Entity
@Table(name = "korisnikentity")

public class KorisnikEntity {
    @Id
    @Column(name = "id")
    private BigInteger id;

    @Column(name = "somedata")
    private String somedata;

    public KorisnikEntity() {
    }

    public KorisnikEntity(final BigInteger id, final String somedata) {
        this.id = id;
        this.somedata = somedata;
    }

    public BigInteger getId() {
        return id;
    }

    public void setId(final BigInteger id) {
        this.id = id;
    }

    public String getSomedata() {
        return somedata;
    }

    public void setSomedata(final String somedata) {
        this.somedata = somedata;
    }
}
