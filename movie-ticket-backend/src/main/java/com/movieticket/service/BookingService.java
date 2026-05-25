package com.movieticket.service;

import com.movieticket.dto.request.BookingRequest;
import com.movieticket.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(Long userId, BookingRequest request);
    BookingResponse confirmBooking(Long bookingId, String paymentMethod);
    void cancelBooking(Long bookingId);
    List<BookingResponse> getUserBookings(Long userId);
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long bookingId);
    void releaseExpiredBookings();
}
