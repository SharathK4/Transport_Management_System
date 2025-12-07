package com.tms.repository;

import com.tms.entity.Transporter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransporterRepository extends JpaRepository<Transporter, UUID> {
    
    @Query("SELECT t FROM Transporter t ORDER BY t.rating DESC")
    List<Transporter> findTopByRating();
}
