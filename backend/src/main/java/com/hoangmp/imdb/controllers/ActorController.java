package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.request.ActorRequest;
import com.hoangmp.imdb.payload.response.ActorResponse;
import com.hoangmp.imdb.services.ActorService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/*
    * Controller quản lý các API liên quan đến diễn viên
*/

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActorController {

    private final ActorService actorService;

    /* API dùng để tạo mới một diễn viên mới */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/actor")
    public ResponseEntity<ActorDTO> createActor(@RequestBody ActorRequest request) {
        ActorDTO response = actorService.createActor(request);
        return ResponseEntity.ok().body(response);
    }

    /* API dùng để xóa một diễn viên theo id */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/actor/{id}")
    public ResponseEntity<ActorDTO> deleteActor(@PathVariable Long id) {
        ActorDTO response = actorService.deleteActor(id);
        return ResponseEntity.ok().body(response);
    }

    /* API dùng để lấy danh sách tất cả diễn viên */
    @PermitAll
    @GetMapping("/actors")
    public ResponseEntity<ActorResponse> getAllActors() {
        ActorResponse response = actorService.getAllActors();
        return ResponseEntity.ok().body(response);
    }

    /* API dùng để cập nhật thông tin một diễn viên theo id */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/actor/{id}")
    public ResponseEntity<ActorDTO> updateActor(@PathVariable Long id, @RequestBody ActorRequest request) {
        ActorDTO response = actorService.updateActor(id, request);
        return ResponseEntity.ok().body(response);
    }

    @PermitAll
    @GetMapping("/actor/{id}")
    public ResponseEntity<ActorDTO> getActor(@PathVariable Long id) {
        ActorDTO response = actorService.getActor(id);
        return ResponseEntity.ok().body(response);
    }
}
