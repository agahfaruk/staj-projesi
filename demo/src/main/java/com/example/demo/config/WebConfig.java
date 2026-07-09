package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // uploads klasörünün bilgisayardaki tam yolunu alıyoruz
        String uploadDir = Paths.get("uploads").toAbsolutePath().toUri().toString();

        // http://localhost:8080/uploads/resim-adi.png isteği geldiğinde uploads klasörüne bak diyoruz
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadDir);
    }
}