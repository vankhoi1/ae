package com.movieticket.service.impl;

import com.movieticket.dto.request.BookingRequest;
import com.movieticket.dto.response.BookingResponse;
import com.movieticket.entity.*;
import com.movieticket.enums.BookingStatus;
import com.movieticket.exception.BadRequestException;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.*;
import com.movieticket.service.BookingService;
import com.movieticket.service.EmailService;
import com.movieticket.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailService emailService;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found"));

        List<Long> occupiedSeatIds = bookingSeatRepository.findOccupiedSeatIdsByShowtime(request.getShowtimeId());
        for (Long seatId : request.getSeatIds()) {
            if (occupiedSeatIds.contains(seatId)) {
                throw new BadRequestException("Seat " + seatId + " is already occupied");
            }
        }

        List<Seat> seats = seatRepository.findAllById(request.getSeatIds());
        if (seats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("Invalid seat IDs");
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<BookingSeat> bookingSeats = new ArrayList<>();

        Booking booking = Booking.builder()
                .user(user)
                .showtime(showtime)
                .totalPrice(BigDecimal.ZERO)
                .status(BookingStatus.PENDING)
                .bookingSeats(new ArrayList<>())
                .build();
        booking = bookingRepository.save(booking);

        for (Seat seat : seats) {
            BigDecimal price = seat.getType().name().equals("VIP")
                    ? showtime.getPriceVip()
                    : showtime.getPriceStandard();
            totalPrice = totalPrice.add(price);

            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .price(price)
                    .build();
            bookingSeats.add(bookingSeat);
        }

        bookingSeatRepository.saveAll(bookingSeats);
        booking.setBookingSeats(bookingSeats);
        booking.setTotalPrice(totalPrice);
        bookingRepository.save(booking);

        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse confirmBooking(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in PENDING status");
        }

        paymentService.processPayment(booking, paymentMethod);
        booking.setStatus(BookingStatus.PAID);
        booking.setPaymentMethod(paymentMethod);
        bookingRepository.save(booking);

        emailService.sendBookingConfirmation(booking);

        return toResponse(booking);
    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return toResponse(booking);
    }

    @Override
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredBookings() {
        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(15);
        List<Booking> expiredBookings = bookingRepository.findExpiredBookings(BookingStatus.PENDING, expiryTime);
        for (Booking booking : expiredBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
        }
        bookingRepository.saveAll(expiredBookings);
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .showtimeId(booking.getShowtime().getId())
                .movieTitle(booking.getShowtime().getMovie().getTitle())
                .showtimeStart(booking.getShowtime().getStartTime())
                .roomName(booking.getShowtime().getRoom().getName())
                .seats(booking.getBookingSeats().stream()
                        .map(bs -> bs.getSeat().getSeatRow() + bs.getSeat().getSeatNumber())
                        .collect(Collectors.toList()))
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .paymentMethod(booking.getPaymentMethod())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
