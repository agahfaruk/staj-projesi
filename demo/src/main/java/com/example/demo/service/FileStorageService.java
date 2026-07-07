package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {
    // resimlerin bilgisayarda kaydedileceği klasör
    private final Path root = Paths.get("uploads");

    public String saveImage(MultipartFile file) {
        try {
            // uploads klasörü yoksa oluştur
            if (!Files.exists(root)) {
                Files.createDirectory(root);
            }
            // dosya adının benzersiz olması için milisaniye ekler
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // dosyayı hedef klasöre kopyala
            Files.copy(file.getInputStream(), this.root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            return fileName; // Veritabanına kaydetmek için dosya adını geri dönüyoruz
        } catch (IOException e) {
            throw new RuntimeException("Dosya yukleme hatasi: " + e.getMessage());
        }
    }
}
