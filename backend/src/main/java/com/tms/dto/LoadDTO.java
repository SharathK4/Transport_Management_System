package com.tms.dto;

import com.tms.entity.Load.LoadStatus;
import com.tms.entity.Load.WeightUnit;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class LoadDTO {
    
    // Request DTO for creating load
    public static class CreateRequest {
        private String shipperId;
        private String loadingCity;
        private String unloadingCity;
        private LocalDateTime loadingDate;
        private String productType;
        private double weight;
        private WeightUnit weightUnit;
        private String truckType;
        private int noOfTrucks;
        
        // Getters and Setters
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
    }
    
    // Response DTO
    public static class Response {
        private UUID loadId;
        private String shipperId;
        private String loadingCity;
        private String unloadingCity;
        private LocalDateTime loadingDate;
        private String productType;
        private double weight;
        private WeightUnit weightUnit;
        private String truckType;
        private int noOfTrucks;
        private int remainingTrucks;
        private LoadStatus status;
        private LocalDateTime datePosted;
        private List<BidDTO.Response> activeBids;
        
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
        public List<BidDTO.Response> getActiveBids() { return activeBids; }
        public void setActiveBids(List<BidDTO.Response> activeBids) { this.activeBids = activeBids; }
    }
    
    // Best Bid Response with score
    public static class BestBidResponse {
        private UUID bidId;
        private UUID transporterId;
        private String transporterName;
        private double transporterRating;
        private double proposedRate;
        private int trucksOffered;
        private double score;
        
        // Getters and Setters
        public UUID getBidId() { return bidId; }
        public void setBidId(UUID bidId) { this.bidId = bidId; }
        public UUID getTransporterId() { return transporterId; }
        public void setTransporterId(UUID transporterId) { this.transporterId = transporterId; }
        public String getTransporterName() { return transporterName; }
        public void setTransporterName(String transporterName) { this.transporterName = transporterName; }
        public double getTransporterRating() { return transporterRating; }
        public void setTransporterRating(double transporterRating) { this.transporterRating = transporterRating; }
        public double getProposedRate() { return proposedRate; }
        public void setProposedRate(double proposedRate) { this.proposedRate = proposedRate; }
        public int getTrucksOffered() { return trucksOffered; }
        public void setTrucksOffered(int trucksOffered) { this.trucksOffered = trucksOffered; }
        public double getScore() { return score; }
        public void setScore(double score) { this.score = score; }
    }
}
