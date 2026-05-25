package com.movieticket.repository;

import com.movieticket.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat> findByBookingId(Long bookingId);

    @Query("SELECT bs.seat.id FROM BookingSeat bs JOIN bs.booking b " +
           "WHERE b.showtime.id = :showtimeId AND b.status IN ('PENDING', 'PAID')")
    List<Long> findOccupiedSeatIdsByShowtime(@Param("showtimeId") Long showtimeId);
}
