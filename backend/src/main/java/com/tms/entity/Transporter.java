package com.tms.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transporters")
public class Transporter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID transporterId;
    
    @Column(nullable = false)
    private String companyName;
    
    @Column(nullable = false)
    private double rating = 3.0;
    
    @OneToMany(mappedBy = "transporter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TruckCapacity> availableTrucks = new ArrayList<>();
    
    // Getters and Setters
    public UUID getTransporterId() { return transporterId; }
    public void setTransporterId(UUID transporterId) { this.transporterId = transporterId; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    public List<TruckCapacity> getAvailableTrucks() { return availableTrucks; }
    public void setAvailableTrucks(List<TruckCapacity> availableTrucks) { this.availableTrucks = availableTrucks; }
    
    public void addTruckCapacity(TruckCapacity capacity) {
        availableTrucks.add(capacity);
        capacity.setTransporter(this);
    }
    
    public int getAvailableTrucksForType(String truckType) {
        return availableTrucks.stream()
            .filter(t -> t.getTruckType().equalsIgnoreCase(truckType))
            .mapToInt(TruckCapacity::getCount)
            .sum();
    }
}
