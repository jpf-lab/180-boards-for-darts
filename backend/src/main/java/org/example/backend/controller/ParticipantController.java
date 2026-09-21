package org.example.backend.controller;

import org.example.backend.dto.ParticipantDTO;
import org.example.backend.model.Participant;
import org.example.backend.repository.ParticipantRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    private final ParticipantRepo participantRepo;

    public ParticipantController(ParticipantRepo participantRepo){
        this.participantRepo = participantRepo;
    }

    @GetMapping
    public List<Participant> getAll() {
        return participantRepo.findAll();
    }

    @GetMapping("/{id}")
    public Participant getById(@PathVariable String id) {
        return participantRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Participant not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Participant create(@RequestBody ParticipantDTO participant) {
        return participantRepo.save(Participant.builder()
                .id(null)
                .firstname(participant.firstname())
                .lastname(participant.lastname())
                .build()
        );
    }

    @PutMapping("/{id}")
    public Participant update(@PathVariable String id, @RequestBody ParticipantDTO participant) {
        if (!participantRepo.existsById(id)) {
            throw new NoSuchElementException("Participant not found");
        }
        return participantRepo.save(Participant.builder()
                .id(id)
                .firstname(participant.firstname())
                .lastname(participant.lastname())
                .build()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        participantRepo.deleteById(id);
    }
}