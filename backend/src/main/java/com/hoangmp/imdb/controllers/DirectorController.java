package com.hoangmp.imdb.controllers;

import com.hoangmp.imdb.payload.dto.DirectorDTO;
import com.hoangmp.imdb.payload.request.DirectorRequest;
import com.hoangmp.imdb.payload.response.DirectorResponse;
import com.hoangmp.imdb.services.DirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
Cac api gom co:
    Tao mot dao dien moi trong co so du lieu
    Xoa mot dao dien ra khoi co so du lieu
    Cap nhap thong tin cua dao dien
    Lay ra danh sach tat ca cac dao dien tron co so du lieu
 */
@RestController
@RequestMapping("/api")
public class DirectorController {
    @Autowired
    private DirectorService directorService;

    @PostMapping("/director")
    public ResponseEntity<DirectorDTO> createDirector(@RequestBody DirectorRequest directorRequest) {
        DirectorDTO response = directorService.createDirector(directorRequest);
        return ResponseEntity.ok().body(response);
    }

    @DeleteMapping("/director/{directorId}")
    public ResponseEntity<DirectorDTO> deleteDirector(@PathVariable Long directorId) {
        DirectorDTO response = directorService.deleteDirector(directorId);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/directors")
    public ResponseEntity<DirectorResponse> getAllDirectors() {
        DirectorResponse response = directorService.getAllDirectors();
        return ResponseEntity.ok().body(response);
    }

    @PutMapping("/director/{id}")
    public ResponseEntity<DirectorDTO> updateDirector(@PathVariable Long id, @RequestBody DirectorRequest directorRequest) {
        DirectorDTO response = directorService.updateDirector(id, directorRequest);
        return ResponseEntity.ok().body(response);
    }
}
