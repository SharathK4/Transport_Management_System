package com.tms.service;

import com.tms.dto.BidDTO;
import com.tms.entity.Bid;
import com.tms.entity.Bid.BidStatus;
import com.tms.entity.Load;
import com.tms.entity.Load.LoadStatus;
import com.tms.entity.Transporter;
import com.tms.exception.InsufficientCapacityException;
import com.tms.exception.InvalidStatusTransitionException;
import com.tms.exception.ResourceNotFoundException;
import com.tms.repository.BidRepository;
import com.tms.repository.LoadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BidService {
    
    private final BidRepository bidRepository;
    private final LoadRepository loadRepository;
    private final LoadService loadService;
    private final TransporterService transporterService;
    
    public BidService(BidRepository bidRepository, LoadRepository loadRepository,
                      LoadService loadService, TransporterService transporterService) {
        this.bidRepository = bidRepository;
        this.loadRepository = loadRepository;
        this.loadService = loadService;
        this.transporterService = transporterService;
    }
    
    public BidDTO.Response createBid(BidDTO.CreateRequest request) {
        // Get load and validate status
        Load load = loadRepository.findById(request.getLoadId())
            .orElseThrow(() -> new ResourceNotFoundException("Load not found with id: " + request.getLoadId()));
        
        if (load.getStatus() == LoadStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Cannot bid on CANCELLED load");
        }
        
        if (load.getStatus() == LoadStatus.BOOKED) {
            throw new InvalidStatusTransitionException("Cannot bid on BOOKED load");
        }
        
        // Get transporter and validate capacity
        Transporter transporter = transporterService.getTransporterEntity(request.getTransporterId());
        
        int availableTrucks = transporter.getAvailableTrucksForType(load.getTruckType());
        if (request.getTrucksOffered() > availableTrucks) {
            throw new InsufficientCapacityException(
                "Insufficient truck capacity. Available: " + availableTrucks + 
                ", Requested: " + request.getTrucksOffered());
        }
        
        // Validate trucks offered against remaining trucks needed
        if (request.getTrucksOffered() > load.getRemainingTrucks()) {
            throw new InvalidStatusTransitionException(
                "Cannot offer more trucks than remaining. Remaining: " + load.getRemainingTrucks());
        }
        
        // Create bid
        Bid bid = new Bid();
        bid.setLoad(load);
        bid.setTransporter(transporter);
        bid.setProposedRate(request.getProposedRate());
        bid.setTrucksOffered(request.getTrucksOffered());
        bid.setStatus(BidStatus.PENDING);
        
        Bid saved = bidRepository.save(bid);
        
        // Update load status to OPEN_FOR_BIDS if it was POSTED
        loadService.updateStatusToOpenForBids(load.getLoadId());
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<BidDTO.Response> getBids(UUID loadId, UUID transporterId, BidStatus status) {
        return bidRepository.findByFilters(loadId, transporterId, status).stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public BidDTO.Response getBidById(UUID bidId) {
        Bid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));
        return mapToResponse(bid);
    }
    
    public BidDTO.Response rejectBid(UUID bidId) {
        Bid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));
        
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidStatusTransitionException("Can only reject PENDING bids");
        }
        
        bid.setStatus(BidStatus.REJECTED);
        Bid saved = bidRepository.save(bid);
        return mapToResponse(saved);
    }
    
    public Bid getBidEntity(UUID bidId) {
        return bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));
    }
    
    public void acceptBid(UUID bidId) {
        Bid bid = bidRepository.findById(bidId)
            .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));
        bid.setStatus(BidStatus.ACCEPTED);
        bidRepository.save(bid);
    }
    
    private BidDTO.Response mapToResponse(Bid bid) {
        BidDTO.Response response = new BidDTO.Response();
        response.setBidId(bid.getBidId());
        response.setLoadId(bid.getLoad().getLoadId());
        response.setTransporterId(bid.getTransporter().getTransporterId());
        response.setTransporterName(bid.getTransporter().getCompanyName());
        response.setTransporterRating(bid.getTransporter().getRating());
        response.setProposedRate(bid.getProposedRate());
        response.setTrucksOffered(bid.getTrucksOffered());
        response.setStatus(bid.getStatus());
        response.setSubmittedAt(bid.getSubmittedAt());
        return response;
    }
}
