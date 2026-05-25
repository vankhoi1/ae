package com.movieticket.service;

import com.movieticket.entity.Booking;

public interface EmailService {
    void sendBookingConfirmation(Booking booking);
}
