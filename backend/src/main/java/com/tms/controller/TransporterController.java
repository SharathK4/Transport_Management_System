package com.tms.controller;

import com.tms.dto.TransporterDTO;
import com.tms.service.TransporterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transporter")
@CrossOrigin(origins = "*")
public class TransporterController {
    
    private final TransporterService transporterService;
    
    public TransporterController(TransporterService transporterService) {
        this.transporterService = transporterService;
    }
    
    @PostMapping
    public ResponseEntity<TransporterDTO.Response> createTransporter(@RequestBody TransporterDTO.CreateRequest request) {
        TransporterDTO.Response response = transporterService.createTransporter(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{transporterId}")
    public ResponseEntity<TransporterDTO.Response> getTransporterById(@PathVariable UUID transporterId) {
        TransporterDTO.Response response = transporterService.getTransporterById(transporterId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TransporterDTO.Response>> getAllTransporters() {
        List<TransporterDTO.Response> transporters = transporterService.getAllTransporters();
        return ResponseEntity.ok(transporters);
    }
    
    @PutMapping("/{transporterId}/trucks")
    public ResponseEntity<TransporterDTO.Response> updateTrucks(
            @PathVariable UUID transporterId,
            @RequestBody TransporterDTO.UpdateTrucksRequest request) {
        TransporterDTO.Response response = transporterService.updateTrucks(transporterId, request);
        return ResponseEntity.ok(response);
    }
}
