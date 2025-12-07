package com.tms.repository;

import com.tms.entity.Load;
import com.tms.entity.Load.LoadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface LoadRepository extends JpaRepository<Load, UUID> {
    
    @Query("SELECT l FROM Load l WHERE " +
           "(:shipperId IS NULL OR l.shipperId = :shipperId) AND " +
           "(:status IS NULL OR l.status = :status)")
    Page<Load> findByFilters(
        @Param("shipperId") String shipperId,
        @Param("status") LoadStatus status,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(l) FROM Load l WHERE l.status = :status")
    long countByStatus(@Param("status") LoadStatus status);
}
