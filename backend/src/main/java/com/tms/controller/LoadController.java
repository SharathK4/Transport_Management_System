package com.tms.controller;

import com.tms.dto.LoadDTO;
import com.tms.entity.Load.LoadStatus;
import com.tms.service.LoadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/load")
@CrossOrigin(origins = "*")
public class LoadController {
    
    private final LoadService loadService;
    
    public LoadController(LoadService loadService) {
        this.loadService = loadService;
    }
    
    @PostMapping
    public ResponseEntity<LoadDTO.Response> createLoad(@RequestBody LoadDTO.CreateRequest request) {
        LoadDTO.Response response = loadService.createLoad(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<Page<LoadDTO.Response>> getLoads(
            @RequestParam(required = false) String shipperId,
            @RequestParam(required = false) LoadStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<LoadDTO.Response> loads = loadService.getLoads(shipperId, status, PageRequest.of(page, size));
        return ResponseEntity.ok(loads);
    }
    
    @GetMapping("/{loadId}")
    public ResponseEntity<LoadDTO.Response> getLoadById(@PathVariable UUID loadId) {
        LoadDTO.Response response = loadService.getLoadById(loadId);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{loadId}/cancel")
    public ResponseEntity<LoadDTO.Response> cancelLoad(@PathVariable UUID loadId) {
        LoadDTO.Response response = loadService.cancelLoad(loadId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{loadId}/best-bids")
    public ResponseEntity<List<LoadDTO.BestBidResponse>> getBestBids(@PathVariable UUID loadId) {
        List<LoadDTO.BestBidResponse> bestBids = loadService.getBestBids(loadId);
        return ResponseEntity.ok(bestBids);
    }
}
