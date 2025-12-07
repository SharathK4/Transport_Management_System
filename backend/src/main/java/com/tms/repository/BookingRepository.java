package com.tms.repository;

import com.tms.entity.Booking;
import com.tms.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    
    @Query("SELECT COALESCE(SUM(b.allocatedTrucks), 0) FROM Booking b " +
           "WHERE b.load.loadId = :loadId AND b.status != 'CANCELLED'")
    int sumAllocatedTrucksByLoadId(@Param("loadId") UUID loadId);
    
    List<Booking> findByLoadLoadId(UUID loadId);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") BookingStatus status);
    
    boolean existsByBidBidId(UUID bidId);
}
