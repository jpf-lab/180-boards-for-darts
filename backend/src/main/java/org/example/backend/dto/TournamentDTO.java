package org.example.backend.dto;

import java.time.Instant;
import java.util.List;

public record TournamentDTO(
        String name,
        Instant datetime,
        String locationId,
        List<String> participantIds,
        List<String> playfieldIds
) {
}