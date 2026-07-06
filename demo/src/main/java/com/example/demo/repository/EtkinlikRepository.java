package com.example.demo.repository;

import com.example.demo.entity.Etkinlik;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtkinlikRepository extends JpaRepository<Etkinlik, Long>{// Spring Data JPA save, findById, deleteById ve findAll metodlarını otomatik sağlar

}
