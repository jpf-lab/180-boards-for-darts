package org.example.backend.service;

import org.example.backend.model.Participant;
import org.example.backend.repository.ParticipantRepo;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class ParticipantService {

    private final ParticipantRepo participantRepo;

    public ParticipantService(ParticipantRepo participantRepo) {
        this.participantRepo = participantRepo;
    }

    public List<Participant> search(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String[] tokens = Arrays.stream(query.trim().split("\\s+"))
                .sorted(Comparator.comparingInt(String::length).reversed())
                .toArray(String[]::new);

        List<Participant> candidates =
                participantRepo.searchByToken(Pattern.quote(tokens[0]), tokens[0]);

        return candidates.stream()
                .filter(p -> Arrays.stream(tokens).allMatch(token -> matches(p, token)))
                .toList();
    }

    private boolean matches(Participant p, String token) {
        String lower = token.toLowerCase(Locale.ROOT);
        return contains(p.firstname(), lower)
                || contains(p.lastname(), lower)
                || token.equals(p.id());
    }

    private boolean contains(String value, String lowerToken) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(lowerToken);
    }
}