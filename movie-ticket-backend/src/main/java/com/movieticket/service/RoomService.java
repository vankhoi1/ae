package com.movieticket.service;

import com.movieticket.dto.response.RoomResponse;
import com.movieticket.dto.response.SeatResponse;
import com.movieticket.entity.Room;

import java.util.List;

public interface RoomService {
    List<RoomResponse> getAllRooms();
    RoomResponse getRoomById(Long id);
    Room createRoom(String name, Integer rows, Integer columns);
    void deleteRoom(Long id);
    List<SeatResponse> getSeatsByRoomAndShowtime(Long roomId, Long showtimeId);
}
