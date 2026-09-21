package org.example.backend.controller;

import org.example.backend.model.Playfield;
import org.example.backend.repository.PlayfieldRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/playfields")
public class PlayfieldController {

    private final PlayfieldRepo playfieldRepo;

    public PlayfieldController(PlayfieldRepo playfieldRepo) {
        this.playfieldRepo = playfieldRepo;
    }

    @GetMapping
    public List<Playfield> getAll() {
        return playfieldRepo.findAll();
    }

    @GetMapping("/{id}")
    public Playfield getById(@PathVariable String id) {
        return playfieldRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Playfield not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Playfield create(@RequestBody Playfield playfield) {
        return playfieldRepo.save(playfield);
    }

    @PutMapping("/{id}")
    public Playfield update(@PathVariable String id, @RequestBody Playfield playfield) {
        if (!playfieldRepo.existsById(id)) {
            throw new NoSuchElementException("Playfield not found");
        }
        return playfieldRepo.save(playfield.withId(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        playfieldRepo.deleteById(id);
    }
}