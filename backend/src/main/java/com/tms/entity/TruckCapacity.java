package com.tms.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "truck_capacities")
public class TruckCapacity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private Transporter transporter;
    
    @Column(nullable = false)
    private String truckType;
    
    @Column(nullable = false)
    private int count;
    
    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public Transporter getTransporter() { return transporter; }
    public void setTransporter(Transporter transporter) { this.transporter = transporter; }
    
    public String getTruckType() { return truckType; }
    public void setTruckType(String truckType) { this.truckType = truckType; }
    
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
