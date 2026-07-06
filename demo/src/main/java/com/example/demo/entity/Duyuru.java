package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jdk.jfr.DataAmount;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("DUYURU")// DB'deki etkinlik_turu "DUYURU" olarak yazar
@Data
@EqualsAndHashCode(callSuper=true)// Lombok'un miras alan sınıflarda düzgün çalışması için gerek duyuluyor
public class Duyuru extends Etkinlik {
    @Column(name="resim_yolu")
    private String  resim;
}
