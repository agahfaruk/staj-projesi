package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.EtkinlikRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor//Repository, Factory ve FileStorage bağımlılıklarını otomatik bağlar
public class EtkinlikService {
    private final EtkinlikRepository repository;
    private final EtkinlikFactory factory;
    private final FileStorageService fileStorageService;

    // 1 Haber ekleme
    public Haber haberEkle(String konu, String icerik, LocalDate tarih, String link){
        Haber haber =   (Haber) factory.createEtkinlik("HABER");
        haber.setKonu(konu);
        haber.setIcerik(icerik);
        haber.setGecerlilikTarihi(tarih);
        haber.setHaberLinki(link);
        return repository.save(haber);
    }

    // 2 Duyuru ekleme
    public Duyuru duyuruEkle(String konu, String icerik, LocalDate tarih, MultipartFile resimDosyasi){
        Duyuru duyuru = (Duyuru) factory.createEtkinlik("DUYURU");
        duyuru.setKonu(konu);
        duyuru.setIcerik(icerik);
        duyuru.setGecerlilikTarihi(tarih);

        // resim yüklenmişse resmi klasöre kaydeder ve ismini db'ye yazar
        if (resimDosyasi != null && !resimDosyasi.isEmpty()){
            String kaydedilenIsim = fileStorageService.saveImage(resimDosyasi);
            duyuru.setResim(kaydedilenIsim);
        }

        return repository.save(duyuru);
    }

    // 3 Listeleme
    public List<Etkinlik> tumEtkinlikleriGetir(){
        return repository.findAll();
    }

    // 4 Silme
    public void sil(Long id){
        repository.deleteById(id);
    }
}
