package com.example.demo.controller;

import com.example.demo.entity.Duyuru;
import com.example.demo.entity.Etkinlik;
import com.example.demo.entity.Haber;
import com.example.demo.service.EtkinlikService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/etkinlikler")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")// Frontend bağlanırken CORS hatası almamak için ekledik
public class EtkinlikController {
    private final EtkinlikService etkinlikService;

    //1 Tüm haber ve duyuruları listeleme (GET)
    @GetMapping
    public ResponseEntity<List<Etkinlik>> tumEtkinlikleriGetir(){
        return ResponseEntity.ok(etkinlikService.tumEtkinlikleriGetir());
    }

    //2 Haber ekleme (POST)
    @PostMapping("/haber")
    public  ResponseEntity<Haber> haberEkle(
            @RequestParam String konu,
            @RequestParam String icerik,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tarih,
            @RequestParam String link){
        return ResponseEntity.ok(etkinlikService.haberEkle(konu, icerik, tarih, link));
    }

    //3 Duyuru ekleme (POST)
    @PostMapping("/duyuru")
    public  ResponseEntity<Duyuru> duyuruEkle(
            @RequestParam String konu,
            @RequestParam String icerik,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tarih,
            @RequestParam(required = false)MultipartFile resim
            ){
        return ResponseEntity.ok(etkinlikService.duyuruEkle(konu, icerik, tarih, resim));
    }

    //4 Etkinlik silme (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> sil(@PathVariable Long id){
        etkinlikService.sil(id);
        return ResponseEntity.ok("Etkinlik silindi. ID= " + id);
    }
}
