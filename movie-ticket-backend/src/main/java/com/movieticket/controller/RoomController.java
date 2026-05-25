package com.movieticket.controller;

import com.movieticket.dto.response.RoomResponse;
import com.movieticket.dto.response.SeatResponse;
import com.movieticket.entity.Room;
import com.movieticket.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/{roomId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeats(
            @PathVariable Long roomId,
            @RequestParam Long showtimeId) {
        return ResponseEntity.ok(roomService.getSeatsByRoomAndShowtime(roomId, showtimeId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponse> createRoom(@RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        Integer rows = (Integer) body.get("rows");
        Integer columns = (Integer) body.get("columns");
        Room room = roomService.createRoom(name, rows, columns);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RoomResponse.builder()
                        .id(room.getId())
                        .name(room.getName())
                        .rowsCount(room.getRowsCount())
                        .columnsCount(room.getColumnsCount())
                        .build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
