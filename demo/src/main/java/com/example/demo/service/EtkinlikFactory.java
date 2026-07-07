package com.example.demo.service;
import com.example.demo.entity.*;
import org.springframework.stereotype.Component;

@Component // spring'in bu sınıfı yönetmesi ve diğer sınıflara enjekte edebilmesi için
public class EtkinlikFactory {
    public Etkinlik createEtkinlik(String tur){
        if(tur==null){
            throw new IllegalArgumentException("Etkinlik turu bos olamaz!");
        }

        // gelen türe göre doğru nesneyi üretip geri döndürür
        return switch (tur.toUpperCase()){
            case "HABER" -> new Haber();
            case "DUYURU" -> new Duyuru();
            default -> throw new IllegalArgumentException("Bilinmeyen etkinlik turu: " + tur);
        };
    };
}
