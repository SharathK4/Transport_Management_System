package com.tms.service;

import com.tms.dto.BidDTO;
import com.tms.dto.LoadDTO;
import com.tms.entity.Bid;
import com.tms.entity.Load;
import com.tms.entity.Load.LoadStatus;
import com.tms.exception.InvalidStatusTransitionException;
import com.tms.exception.ResourceNotFoundException;
import com.tms.repository.BidRepository;
import com.tms.repository.LoadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoadService {
    
    private final LoadRepository loadRepository;
    private final BidRepository bidRepository;
    
    public LoadService(LoadRepository loadRepository, BidRepository bidRepository) {
        this.loadRepository = loadRepository;
        this.bidRepository = bidRepository;
    }
    
    public LoadDTO.Response createLoad(LoadDTO.CreateRequest request) {
        Load load = new Load();
        load.setShipperId(request.getShipperId());
        load.setLoadingCity(request.getLoadingCity());
        load.setUnloadingCity(request.getUnloadingCity());
        load.setLoadingDate(request.getLoadingDate());
        load.setProductType(request.getProductType());
        load.setWeight(request.getWeight());
        load.setWeightUnit(request.getWeightUnit());
        load.setTruckType(request.getTruckType());
        load.setNoOfTrucks(request.getNoOfTrucks());
        load.setRemainingTrucks(request.getNoOfTrucks());
        load.setStatus(LoadStatus.POSTED);
        
        Load saved = loadRepository.save(load);
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public Page<LoadDTO.Response> getLoads(String shipperId, LoadStatus status, Pageable pageable) {
        return loadRepository.findByFilters(shipperId, status, pageable)
            .map(this::mapToResponse);
    }
    
    @Transactional(readOnly = true)
    public LoadDTO.Response getLoadById(UUID loadId) {
        Load load = loadRepository.findById(loadId)
            .orElseThrow(() -> new ResourceNotFoundException("Load not found with id: " + loadId));
        
        LoadDTO.Response response = mapToResponse(load);
        
        // Get active bids for this load
        List<Bid> activeBids = bidRepository.findPendingBidsByLoadId(loadId);
        response.setActiveBids(activeBids.stream()
            .map(this::mapBidToResponse)
            .collect(Collectors.toList()));
        
        return response;
    }
    
    public LoadDTO.Response cancelLoad(UUID loadId) {
        Load load = loadRepository.findById(loadId)
            .orElseThrow(() -> new ResourceNotFoundException("Load not found with id: " + loadId));
        
        if (load.getStatus() == LoadStatus.BOOKED) {
            throw new InvalidStatusTransitionException("Cannot cancel a load that is already BOOKED");
        }
        
        if (load.getStatus() == LoadStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Load is already CANCELLED");
        }
        
        load.setStatus(LoadStatus.CANCELLED);
        
        // Reject all pending bids
        List<Bid> pendingBids = bidRepository.findPendingBidsByLoadId(loadId);
        pendingBids.forEach(bid -> bid.setStatus(Bid.BidStatus.REJECTED));
        bidRepository.saveAll(pendingBids);
        
        Load saved = loadRepository.save(load);
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public List<LoadDTO.BestBidResponse> getBestBids(UUID loadId) {
        Load load = loadRepository.findById(loadId)
            .orElseThrow(() -> new ResourceNotFoundException("Load not found with id: " + loadId));
        
        List<Bid> pendingBids = bidRepository.findPendingBidsByLoadId(loadId);
        
        return pendingBids.stream()
            .map(bid -> {
                LoadDTO.BestBidResponse response = new LoadDTO.BestBidResponse();
                response.setBidId(bid.getBidId());
                response.setTransporterId(bid.getTransporter().getTransporterId());
                response.setTransporterName(bid.getTransporter().getCompanyName());
                response.setTransporterRating(bid.getTransporter().getRating());
                response.setProposedRate(bid.getProposedRate());
                response.setTrucksOffered(bid.getTrucksOffered());
                
                // Calculate score: (1 / proposedRate) * 0.7 + (rating / 5) * 0.3
                double rateScore = (1.0 / bid.getProposedRate()) * 0.7;
                double ratingScore = (bid.getTransporter().getRating() / 5.0) * 0.3;
                response.setScore(rateScore + ratingScore);
                
                return response;
            })
            .sorted(Comparator.comparingDouble(LoadDTO.BestBidResponse::getScore).reversed())
            .collect(Collectors.toList());
    }
    
    public void updateStatusToOpenForBids(UUID loadId) {
        Load load = loadRepository.findById(loadId)
            .orElseThrow(() -> new ResourceNotFoundException("Load not found with id: " + loadId));
        
        if (load.getStatus() == LoadStatus.POSTED) {
            load.setStatus(LoadStatus.OPEN_FOR_BIDS);
            loadRepository.save(load);
        }
    }
    
    private LoadDTO.Response mapToResponse(Load load) {
        LoadDTO.Response response = new LoadDTO.Response();
        response.setLoadId(load.getLoadId());
        response.setShipperId(load.getShipperId());
        response.setLoadingCity(load.getLoadingCity());
        response.setUnloadingCity(load.getUnloadingCity());
        response.setLoadingDate(load.getLoadingDate());
        response.setProductType(load.getProductType());
        response.setWeight(load.getWeight());
        response.setWeightUnit(load.getWeightUnit());
        response.setTruckType(load.getTruckType());
        response.setNoOfTrucks(load.getNoOfTrucks());
        response.setRemainingTrucks(load.getRemainingTrucks());
        response.setStatus(load.getStatus());
        response.setDatePosted(load.getDatePosted());
        return response;
    }
    
    private BidDTO.Response mapBidToResponse(Bid bid) {
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
