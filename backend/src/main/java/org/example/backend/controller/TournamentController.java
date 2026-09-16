package org.example.backend.controller;

import org.bson.types.ObjectId;
import org.example.backend.model.Tournament;
import org.example.backend.repository.TournamentRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    private final TournamentRepo tournamentRepo;

    public TournamentController(TournamentRepo tournamentRepo) {
        this.tournamentRepo = tournamentRepo;
    }

    @GetMapping
    public List<Tournament> getAll() {
        return tournamentRepo.findAll();
    }

    @GetMapping("/{id}")
    public Tournament getById(@PathVariable String id) {
        return tournamentRepo.findById(new ObjectId(id))
                .orElseThrow(() -> new NoSuchElementException("Tournament not found"));
    }

    @GetMapping(params = "locationId")
    public List<Tournament> getByLocationId(@RequestParam String locationId) {
        return tournamentRepo.findByLocationId(new ObjectId(locationId));
    }

    @GetMapping(params = "participantId")
    public List<Tournament> getByParticipantId(@RequestParam String participantId) {
        return tournamentRepo.findByParticipantIdsContaining(new ObjectId(participantId));
    }

    @GetMapping(params = "playfieldId")
    public List<Tournament> getByPlayfieldId(@RequestParam String playfieldId) {
        return tournamentRepo.findByPlayfieldIdsContaining(new ObjectId(playfieldId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tournament create(@RequestBody Tournament tournament) {
        return tournamentRepo.save(tournament);
    }

    @PutMapping("/{id}")
    public Tournament update(@PathVariable String id, @RequestBody Tournament tournament) {
        ObjectId objectId = new ObjectId(id);
        if (!tournamentRepo.existsById(objectId)) {
            throw new NoSuchElementException("Tournament not found");
        }
        return tournamentRepo.save(tournament.withId(objectId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        tournamentRepo.deleteById(new ObjectId(id));
    }
}