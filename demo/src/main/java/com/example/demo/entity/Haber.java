package com.example.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jdk.jfr.DataAmount;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@DiscriminatorValue("HABER")// DB'deki etkinlik_turu "HABER" olarak yazar
@Data
@EqualsAndHashCode(callSuper = true)//  Lombok'un miras alan sınıflarda düzgün çalışması için gerekl duyuluyor
public class Haber extends Etkinlik {
    @Column(name = "haber_linki")// DB'deki snake_case tipi için
    private String haberLinki;
}
