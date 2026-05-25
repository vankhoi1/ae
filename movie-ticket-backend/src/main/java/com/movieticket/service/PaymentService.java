package com.movieticket.service;

import com.movieticket.entity.Booking;
import com.movieticket.entity.Payment;

public interface PaymentService {
    Payment processPayment(Booking booking, String method);
    Payment handleVnpayCallback(String transactionId, String responseCode);
}
