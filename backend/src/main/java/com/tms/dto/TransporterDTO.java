package com.tms.dto;

import java.util.List;
import java.util.UUID;

public class TransporterDTO {
    
    public static class TruckCapacityDTO {
        private String truckType;
        private int count;
        
        public String getTruckType() { return truckType; }
        public void setTruckType(String truckType) { this.truckType = truckType; }
        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }
    }
    
    public static class CreateRequest {
        private String companyName;
        private double rating;
        private List<TruckCapacityDTO> availableTrucks;
        
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        public List<TruckCapacityDTO> getAvailableTrucks() { return availableTrucks; }
        public void setAvailableTrucks(List<TruckCapacityDTO> availableTrucks) { this.availableTrucks = availableTrucks; }
    }
    
    public static class UpdateTrucksRequest {
        private List<TruckCapacityDTO> availableTrucks;
        
        public List<TruckCapacityDTO> getAvailableTrucks() { return availableTrucks; }
        public void setAvailableTrucks(List<TruckCapacityDTO> availableTrucks) { this.availableTrucks = availableTrucks; }
    }
    
    public static class Response {
        private UUID transporterId;
        private String companyName;
        private double rating;
        private List<TruckCapacityDTO> availableTrucks;
        
        public UUID getTransporterId() { return transporterId; }
        public void setTransporterId(UUID transporterId) { this.transporterId = transporterId; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public double getRating() { return rating; }
        public void setRating(double rating) { this.rating = rating; }
        public List<TruckCapacityDTO> getAvailableTrucks() { return availableTrucks; }
        public void setAvailableTrucks(List<TruckCapacityDTO> availableTrucks) { this.availableTrucks = availableTrucks; }
    }
}
