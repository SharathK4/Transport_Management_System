package com.tms.controller;

import com.tms.dto.BookingDTO;
import com.tms.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "*")
public class BookingController {
    
    private final BookingService bookingService;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @PostMapping
    public ResponseEntity<BookingDTO.Response> createBooking(@RequestBody BookingDTO.CreateRequest request) {
        BookingDTO.Response response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingDTO.Response> getBookingById(@PathVariable UUID bookingId) {
        BookingDTO.Response response = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<BookingDTO.Response>> getAllBookings() {
        List<BookingDTO.Response> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDTO.Response> cancelBooking(@PathVariable UUID bookingId) {
        BookingDTO.Response response = bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(response);
    }
}
