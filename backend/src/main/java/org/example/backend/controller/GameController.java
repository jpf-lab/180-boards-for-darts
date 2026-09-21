package org.example.backend.controller;

import org.example.backend.model.Game;
import org.example.backend.repository.GameRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private final GameRepo gameRepo;

    public GameController(GameRepo gameRepo) {
        this.gameRepo = gameRepo;
    }

    @GetMapping
    public List<Game> getAll() {
        return gameRepo.findAll();
    }

    @GetMapping("/{id}")
    public Game getById(@PathVariable String id) {
        return gameRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Game not found"));
    }

    @GetMapping(params = "tournamentId")
    public List<Game> getByTournamentId(
            @RequestParam String tournamentId,
            @RequestParam(required = false) Integer round) {
        return round != null
                ? gameRepo.findByTournamentIdAndRound(tournamentId, round)
                : gameRepo.findByTournamentId(tournamentId);
    }

    @GetMapping(params = "playfieldId")
    public List<Game> getByPlayfieldId(@RequestParam String playfieldId) {
        return gameRepo.findByPlayfieldId(playfieldId);
    }

    @GetMapping(params = "participantId")
    public List<Game> getByParticipantId(@RequestParam String participantId) {
        return gameRepo.findByParticipantId(participantId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Game create(@RequestBody Game game) {
        return gameRepo.save(game);
    }

    @PutMapping("/{id}")
    public Game update(@PathVariable String id, @RequestBody Game game) {
        if (!gameRepo.existsById(id)) {
            throw new NoSuchElementException("Game not found");
        }
        return gameRepo.save(game.withId(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        gameRepo.deleteById(id);
    }
}