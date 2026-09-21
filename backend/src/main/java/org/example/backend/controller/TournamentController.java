package org.example.backend.controller;

import org.example.backend.dto.TournamentDTO;
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
        return tournamentRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Tournament not found"));
    }

    @GetMapping(params = "locationId")
    public List<Tournament> getByLocationId(@RequestParam String locationId) {
        return tournamentRepo.findByLocationId(locationId);
    }

    @GetMapping(params = "participantId")
    public List<Tournament> getByParticipantId(@RequestParam String participantId) {
        return tournamentRepo.findByParticipantIdsContaining(participantId);
    }

    @GetMapping(params = "playfieldId")
    public List<Tournament> getByPlayfieldId(@RequestParam String playfieldId) {
        return tournamentRepo.findByPlayfieldIdsContaining(playfieldId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tournament create(@RequestBody TournamentDTO tournament) {
        return tournamentRepo.save(Tournament.builder()
                .name(tournament.name())
                .datetime(tournament.datetime())
                .locationId(tournament.locationId())
                .participantIds(tournament.participantIds())
                .playfieldIds(tournament.playfieldIds())
                .build()
        );
    }

    @PutMapping("/{id}")
    public Tournament update(@PathVariable String id, @RequestBody TournamentDTO tournament) {
        if (!tournamentRepo.existsById(id)) {
            throw new NoSuchElementException("Tournament not found");
        }
        return tournamentRepo.save(Tournament.builder()
                .id(id)
                .name(tournament.name())
                .datetime(tournament.datetime())
                .locationId(tournament.locationId())
                .participantIds(tournament.participantIds())
                .playfieldIds(tournament.playfieldIds())
                .build()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        tournamentRepo.deleteById(id);
    }
}