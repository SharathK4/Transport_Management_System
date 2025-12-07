package com.tms.service;

import com.tms.dto.TransporterDTO;
import com.tms.entity.Transporter;
import com.tms.entity.TruckCapacity;
import com.tms.exception.ResourceNotFoundException;
import com.tms.repository.TransporterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransporterService {
    
    private final TransporterRepository transporterRepository;
    
    public TransporterService(TransporterRepository transporterRepository) {
        this.transporterRepository = transporterRepository;
    }
    
    public TransporterDTO.Response createTransporter(TransporterDTO.CreateRequest request) {
        Transporter transporter = new Transporter();
        transporter.setCompanyName(request.getCompanyName());
        transporter.setRating(request.getRating() > 0 ? request.getRating() : 3.0);
        
        if (request.getAvailableTrucks() != null) {
            for (TransporterDTO.TruckCapacityDTO truckDTO : request.getAvailableTrucks()) {
                TruckCapacity capacity = new TruckCapacity();
                capacity.setTruckType(truckDTO.getTruckType());
                capacity.setCount(truckDTO.getCount());
                transporter.addTruckCapacity(capacity);
            }
        }
        
        Transporter saved = transporterRepository.save(transporter);
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public TransporterDTO.Response getTransporterById(UUID transporterId) {
        Transporter transporter = transporterRepository.findById(transporterId)
            .orElseThrow(() -> new ResourceNotFoundException("Transporter not found with id: " + transporterId));
        return mapToResponse(transporter);
    }
    
    @Transactional(readOnly = true)
    public List<TransporterDTO.Response> getAllTransporters() {
        return transporterRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public TransporterDTO.Response updateTrucks(UUID transporterId, TransporterDTO.UpdateTrucksRequest request) {
        Transporter transporter = transporterRepository.findById(transporterId)
            .orElseThrow(() -> new ResourceNotFoundException("Transporter not found with id: " + transporterId));
        
        // Clear existing truck capacities
        transporter.getAvailableTrucks().clear();
        
        // Add new truck capacities
        if (request.getAvailableTrucks() != null) {
            for (TransporterDTO.TruckCapacityDTO truckDTO : request.getAvailableTrucks()) {
                TruckCapacity capacity = new TruckCapacity();
                capacity.setTruckType(truckDTO.getTruckType());
                capacity.setCount(truckDTO.getCount());
                transporter.addTruckCapacity(capacity);
            }
        }
        
        Transporter saved = transporterRepository.save(transporter);
        return mapToResponse(saved);
    }
    
    public Transporter getTransporterEntity(UUID transporterId) {
        return transporterRepository.findById(transporterId)
            .orElseThrow(() -> new ResourceNotFoundException("Transporter not found with id: " + transporterId));
    }
    
    public void updateTruckCount(UUID transporterId, String truckType, int delta) {
        Transporter transporter = getTransporterEntity(transporterId);
        
        for (TruckCapacity capacity : transporter.getAvailableTrucks()) {
            if (capacity.getTruckType().equalsIgnoreCase(truckType)) {
                capacity.setCount(capacity.getCount() + delta);
                break;
            }
        }
        
        transporterRepository.save(transporter);
    }
    
    private TransporterDTO.Response mapToResponse(Transporter transporter) {
        TransporterDTO.Response response = new TransporterDTO.Response();
        response.setTransporterId(transporter.getTransporterId());
        response.setCompanyName(transporter.getCompanyName());
        response.setRating(transporter.getRating());
        
        List<TransporterDTO.TruckCapacityDTO> trucks = transporter.getAvailableTrucks().stream()
            .map(tc -> {
                TransporterDTO.TruckCapacityDTO dto = new TransporterDTO.TruckCapacityDTO();
                dto.setTruckType(tc.getTruckType());
                dto.setCount(tc.getCount());
                return dto;
            })
            .collect(Collectors.toList());
        
        response.setAvailableTrucks(trucks);
        return response;
    }
}
