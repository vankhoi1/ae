package com.movieticket.service.impl;

import com.movieticket.dto.response.RoomResponse;
import com.movieticket.dto.response.SeatResponse;
import com.movieticket.entity.Room;
import com.movieticket.entity.Seat;
import com.movieticket.enums.SeatType;
import com.movieticket.exception.ResourceNotFoundException;
import com.movieticket.repository.BookingSeatRepository;
import com.movieticket.repository.RoomRepository;
import com.movieticket.repository.SeatRepository;
import com.movieticket.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Override
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public RoomResponse getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return toResponse(room);
    }

    @Override
    @Transactional
    public Room createRoom(String name, Integer rows, Integer columns) {
        Room room = Room.builder()
                .name(name)
                .rowsCount(rows)
                .columnsCount(columns)
                .seats(new ArrayList<>())
                .build();

        for (int r = 0; r < rows; r++) {
            for (int c = 1; c <= columns; c++) {
                char rowChar = (char) ('A' + r);
                Seat seat = Seat.builder()
                        .room(room)
                        .seatRow(String.valueOf(rowChar))
                        .seatNumber(c)
                        .type(r < 2 ? SeatType.VIP : SeatType.STANDARD)
                        .build();
                room.getSeats().add(seat);
            }
        }

        return roomRepository.save(room);
    }

    @Override
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new ResourceNotFoundException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    @Override
    public List<SeatResponse> getSeatsByRoomAndShowtime(Long roomId, Long showtimeId) {
        List<Seat> seats = seatRepository.findByRoomIdOrderBySeatRowAscSeatNumberAsc(roomId);
        List<Long> occupiedSeatIds = bookingSeatRepository.findOccupiedSeatIdsByShowtime(showtimeId);
        Set<Long> occupiedSet = occupiedSeatIds.stream().collect(Collectors.toSet());

        return seats.stream().map(seat -> SeatResponse.builder()
                .id(seat.getId())
                .seatRow(seat.getSeatRow())
                .seatNumber(seat.getSeatNumber())
                .type(seat.getType())
                .occupied(occupiedSet.contains(seat.getId()))
                .build()).toList();
    }

    private RoomResponse toResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .rowsCount(room.getRowsCount())
                .columnsCount(room.getColumnsCount())
                .build();
    }
}
