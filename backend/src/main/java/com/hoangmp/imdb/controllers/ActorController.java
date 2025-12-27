package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.ActorDTO;
import com.hoangmp.imdb.payload.request.ActorRequest;
import com.hoangmp.imdb.payload.response.ActorResponse;
import com.hoangmp.imdb.services.ActorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
Cac api co san:
    Them, sua, xoa du lieu dien vien trong database
    lay danh sach tat ca dien vien dang co trong database
*/

@RestController
@RequestMapping("/api")
public class ActorController {

    @Autowired
    private ActorService actorService;

    @PostMapping("/actor")
    public ResponseEntity<ActorDTO> createActor(@RequestBody ActorRequest request) {
        ActorDTO response = actorService.createActor(request);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/actor/{id}")
    public ResponseEntity<ActorDTO> deleteActor(@PathVariable Long id) {
        ActorDTO response = actorService.deleteActor(id);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/actors")
    public ResponseEntity<ActorResponse> getAllActors() {
        ActorResponse response = actorService.getAllActors();
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/actor/{id}")
    public ResponseEntity<ActorDTO> updateActor(@PathVariable Long id, @RequestBody ActorRequest request) {
        ActorDTO response = actorService.updateActor(id, request);
        return ResponseEntity.ok().body(response);
    }
}
