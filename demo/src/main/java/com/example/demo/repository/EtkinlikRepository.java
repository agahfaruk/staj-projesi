package com.example.demo.repository;

import com.example.demo.entity.Etkinlik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtkinlikRepository extends JpaRepository<Etkinlik, Long>{
    List<Etkinlik> id(Long id);// Spring Data JPA save, findById, deleteById ve findAll metodlarını otomatik sağlar

}
