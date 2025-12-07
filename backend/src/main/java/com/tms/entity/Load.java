package com.tms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "loads", indexes = {
    @Index(name = "idx_load_shipper", columnList = "shipperId"),
    @Index(name = "idx_load_status", columnList = "status")
})
public class Load {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID loadId;
    
    @Column(nullable = false)
    private String shipperId;
    
    @Column(nullable = false)
    private String loadingCity;
    
    @Column(nullable = false)
    private String unloadingCity;
    
    @Column(nullable = false)
    private LocalDateTime loadingDate;
    
    @Column(nullable = false)
    private String productType;
    
    @Column(nullable = false)
    private double weight;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WeightUnit weightUnit;
    
    @Column(nullable = false)
    private String truckType;
    
    @Column(nullable = false)
    private int noOfTrucks;
    
    @Column(nullable = false)
    private int remainingTrucks;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoadStatus status = LoadStatus.POSTED;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime datePosted;
    
    @Version
    private Long version;
    
    public enum LoadStatus {
        POSTED, OPEN_FOR_BIDS, BOOKED, CANCELLED
    }
    
    public enum WeightUnit {
        KG, TON
    }
    
    // Getters and Setters
    public UUID getLoadId() { return loadId; }
    public void setLoadId(UUID loadId) { this.loadId = loadId; }
    
    public String getShipperId() { return shipperId; }
    public void setShipperId(String shipperId) { this.shipperId = shipperId; }
    
    public String getLoadingCity() { return loadingCity; }
    public void setLoadingCity(String loadingCity) { this.loadingCity = loadingCity; }
    
    public String getUnloadingCity() { return unloadingCity; }
    public void setUnloadingCity(String unloadingCity) { this.unloadingCity = unloadingCity; }
    
    public LocalDateTime getLoadingDate() { return loadingDate; }
    public void setLoadingDate(LocalDateTime loadingDate) { this.loadingDate = loadingDate; }
    
    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }
    
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    
    public WeightUnit getWeightUnit() { return weightUnit; }
    public void setWeightUnit(WeightUnit weightUnit) { this.weightUnit = weightUnit; }
    
    public String getTruckType() { return truckType; }
    public void setTruckType(String truckType) { this.truckType = truckType; }
    
    public int getNoOfTrucks() { return noOfTrucks; }
    public void setNoOfTrucks(int noOfTrucks) { this.noOfTrucks = noOfTrucks; }
    
    public int getRemainingTrucks() { return remainingTrucks; }
    public void setRemainingTrucks(int remainingTrucks) { this.remainingTrucks = remainingTrucks; }
    
    public LoadStatus getStatus() { return status; }
    public void setStatus(LoadStatus status) { this.status = status; }
    
    public LocalDateTime getDatePosted() { return datePosted; }
    public void setDatePosted(LocalDateTime datePosted) { this.datePosted = datePosted; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
