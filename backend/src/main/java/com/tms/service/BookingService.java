package com.tms.service;

import com.tms.dto.BookingDTO;
import com.tms.entity.Bid;
import com.tms.entity.Bid.BidStatus;
import com.tms.entity.Booking;
import com.tms.entity.Booking.BookingStatus;
import com.tms.entity.Load;
import com.tms.entity.Load.LoadStatus;
import com.tms.exception.InsufficientCapacityException;
import com.tms.exception.InvalidStatusTransitionException;
import com.tms.exception.LoadAlreadyBookedException;
import com.tms.exception.ResourceNotFoundException;
import com.tms.repository.BookingRepository;
import com.tms.repository.LoadRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final LoadRepository loadRepository;
    private final BidService bidService;
    private final TransporterService transporterService;
    
    public BookingService(BookingRepository bookingRepository, LoadRepository loadRepository,
                          BidService bidService, TransporterService transporterService) {
        this.bookingRepository = bookingRepository;
        this.loadRepository = loadRepository;
        this.bidService = bidService;
        this.transporterService = transporterService;
    }
    
    public BookingDTO.Response createBooking(BookingDTO.CreateRequest request) {
        // Get bid and validate
        Bid bid = bidService.getBidEntity(request.getBidId());
        
        if (bid.getStatus() != BidStatus.PENDING) {
            throw new InvalidStatusTransitionException("Can only accept PENDING bids");
        }
        
        // Check if bid already has a booking
        if (bookingRepository.existsByBidBidId(bid.getBidId())) {
            throw new LoadAlreadyBookedException("This bid has already been accepted");
        }
        
        Load load = bid.getLoad();
        
        // Validate load status
        if (load.getStatus() == LoadStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Cannot book a CANCELLED load");
        }
        
        if (load.getStatus() == LoadStatus.BOOKED) {
            throw new LoadAlreadyBookedException("Load is already fully booked");
        }
        
        // Validate remaining trucks
        if (bid.getTrucksOffered() > load.getRemainingTrucks()) {
            throw new InvalidStatusTransitionException(
                "Cannot allocate more trucks than remaining. Remaining: " + load.getRemainingTrucks());
        }
        
        // Validate transporter capacity
        int availableTrucks = bid.getTransporter().getAvailableTrucksForType(load.getTruckType());
        if (bid.getTrucksOffered() > availableTrucks) {
            throw new InsufficientCapacityException(
                "Transporter no longer has sufficient trucks. Available: " + availableTrucks);
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setLoad(load);
        booking.setBid(bid);
        booking.setTransporter(bid.getTransporter());
        booking.setAllocatedTrucks(bid.getTrucksOffered());
        booking.setFinalRate(bid.getProposedRate());
        booking.setStatus(BookingStatus.CONFIRMED);
        
        // Accept the bid
        bidService.acceptBid(bid.getBidId());
        
        // Deduct trucks from transporter
        transporterService.updateTruckCount(
            bid.getTransporter().getTransporterId(),
            load.getTruckType(),
            -bid.getTrucksOffered()
        );
        
        // Update remaining trucks on load
        int newRemainingTrucks = load.getRemainingTrucks() - bid.getTrucksOffered();
        load.setRemainingTrucks(newRemainingTrucks);
        
        // Update load status if fully booked
        if (newRemainingTrucks == 0) {
            load.setStatus(LoadStatus.BOOKED);
        }
        
        loadRepository.save(load);
        Booking saved = bookingRepository.save(booking);
        
        return mapToResponse(saved);
    }
    
    @Transactional(readOnly = true)
    public BookingDTO.Response getBookingById(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return mapToResponse(booking);
    }
    
    @Transactional(readOnly = true)
    public List<BookingDTO.Response> getAllBookings() {
        return bookingRepository.findAll().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public BookingDTO.Response cancelBooking(UUID bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidStatusTransitionException("Booking is already CANCELLED");
        }
        
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new InvalidStatusTransitionException("Cannot cancel a COMPLETED booking");
        }
        
        // Cancel the booking
        booking.setStatus(BookingStatus.CANCELLED);
        
        // Restore trucks to transporter
        transporterService.updateTruckCount(
            booking.getTransporter().getTransporterId(),
            booking.getLoad().getTruckType(),
            booking.getAllocatedTrucks()
        );
        
        // Update load
        Load load = booking.getLoad();
        load.setRemainingTrucks(load.getRemainingTrucks() + booking.getAllocatedTrucks());
        
        // If load was BOOKED, change back to OPEN_FOR_BIDS
        if (load.getStatus() == LoadStatus.BOOKED) {
            load.setStatus(LoadStatus.OPEN_FOR_BIDS);
        }
        
        loadRepository.save(load);
        Booking saved = bookingRepository.save(booking);
        
        return mapToResponse(saved);
    }
    
    private BookingDTO.Response mapToResponse(Booking booking) {
        BookingDTO.Response response = new BookingDTO.Response();
        response.setBookingId(booking.getBookingId());
        response.setLoadId(booking.getLoad().getLoadId());
        response.setBidId(booking.getBid().getBidId());
        response.setTransporterId(booking.getTransporter().getTransporterId());
        response.setTransporterName(booking.getTransporter().getCompanyName());
        response.setLoadingCity(booking.getLoad().getLoadingCity());
        response.setUnloadingCity(booking.getLoad().getUnloadingCity());
        response.setAllocatedTrucks(booking.getAllocatedTrucks());
        response.setFinalRate(booking.getFinalRate());
        response.setStatus(booking.getStatus());
        response.setBookedAt(booking.getBookedAt());
        return response;
    }
}
