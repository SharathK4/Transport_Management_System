package com.tms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bids", indexes = {
    @Index(name = "idx_bid_load", columnList = "load_id"),
    @Index(name = "idx_bid_transporter", columnList = "transporter_id"),
    @Index(name = "idx_bid_status", columnList = "status")
})
public class Bid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bidId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private Transporter transporter;
    
    @Column(nullable = false)
    private double proposedRate;
    
    @Column(nullable = false)
    private int trucksOffered;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BidStatus status = BidStatus.PENDING;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    
    public enum BidStatus {
        PENDING, ACCEPTED, REJECTED
    }
    
    // Getters and Setters
    public UUID getBidId() { return bidId; }
    public void setBidId(UUID bidId) { this.bidId = bidId; }
    
    public Load getLoad() { return load; }
    public void setLoad(Load load) { this.load = load; }
    
    public Transporter getTransporter() { return transporter; }
    public void setTransporter(Transporter transporter) { this.transporter = transporter; }
    
    public double getProposedRate() { return proposedRate; }
    public void setProposedRate(double proposedRate) { this.proposedRate = proposedRate; }
    
    public int getTrucksOffered() { return trucksOffered; }
    public void setTrucksOffered(int trucksOffered) { this.trucksOffered = trucksOffered; }
    
    public BidStatus getStatus() { return status; }
    public void setStatus(BidStatus status) { this.status = status; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
