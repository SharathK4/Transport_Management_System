package com.tms.controller;

import com.tms.dto.BidDTO;
import com.tms.entity.Bid.BidStatus;
import com.tms.service.BidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bid")
@CrossOrigin(origins = "*")
public class BidController {
    
    private final BidService bidService;
    
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }
    
    @PostMapping
    public ResponseEntity<BidDTO.Response> createBid(@RequestBody BidDTO.CreateRequest request) {
        BidDTO.Response response = bidService.createBid(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<BidDTO.Response>> getBids(
            @RequestParam(required = false) UUID loadId,
            @RequestParam(required = false) UUID transporterId,
            @RequestParam(required = false) BidStatus status) {
        List<BidDTO.Response> bids = bidService.getBids(loadId, transporterId, status);
        return ResponseEntity.ok(bids);
    }
    
    @GetMapping("/{bidId}")
    public ResponseEntity<BidDTO.Response> getBidById(@PathVariable UUID bidId) {
        BidDTO.Response response = bidService.getBidById(bidId);
        return ResponseEntity.ok(response);
    }
    
    @PatchMapping("/{bidId}/reject")
    public ResponseEntity<BidDTO.Response> rejectBid(@PathVariable UUID bidId) {
        BidDTO.Response response = bidService.rejectBid(bidId);
        return ResponseEntity.ok(response);
    }
}
