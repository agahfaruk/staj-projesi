package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

import javax.annotation.processing.Generated;
import java.time.LocalDate;

@Entity
@Table(name="etkinlik")// PostgreSQL'de oluşacak tablonun adı
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)// İsterdeki tek bir database tablosunda tutulmalı şartı
@DiscriminatorColumn(name="etkinlik_turu", discriminatorType = DiscriminatorType.STRING)// Haber mi Duyuru mu ayrımı
@Data// Getter, setter ve toString metodlarını otomatik oluşturması için Lombok eklentisi
public abstract class Etkinlik {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)// Otomatik artan id
    private Long id;

    @Column(nullable=false)// Boş geçilemez yapar
    private String konu;

    @Column(columnDefinition="TEXT")// İçerik uzun olabileceğinden ötürü DB'de TEXT olarak tutuyoruz
    private String icerik;

    @Column(name="gecerlilik_tarihi")// DB'de sütun adı snake_case tarzında olması için
    private LocalDate gecerlilikTarihi;
}
