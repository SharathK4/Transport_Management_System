package com.tms.repository;

import com.tms.entity.Bid;
import com.tms.entity.Bid.BidStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface BidRepository extends JpaRepository<Bid, UUID> {
    
    @Query("SELECT b FROM Bid b WHERE " +
           "(:loadId IS NULL OR b.load.loadId = :loadId) AND " +
           "(:transporterId IS NULL OR b.transporter.transporterId = :transporterId) AND " +
           "(:status IS NULL OR b.status = :status)")
    List<Bid> findByFilters(
        @Param("loadId") UUID loadId,
        @Param("transporterId") UUID transporterId,
        @Param("status") BidStatus status
    );
    
    @Query("SELECT b FROM Bid b JOIN FETCH b.transporter WHERE b.load.loadId = :loadId AND b.status = 'PENDING'")
    List<Bid> findPendingBidsByLoadId(@Param("loadId") UUID loadId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.load.loadId = :loadId AND b.status = :status")
    long countByLoadIdAndStatus(@Param("loadId") UUID loadId, @Param("status") BidStatus status);
    
    boolean existsByLoadLoadIdAndTransporterTransporterIdAndStatus(UUID loadId, UUID transporterId, BidStatus status);
}
