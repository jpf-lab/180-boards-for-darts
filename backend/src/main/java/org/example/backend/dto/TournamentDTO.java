package org.example.backend.dto;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Builder
@With
public record TournamentDTO(
        String name,
        Instant datetime,
        String locationId,
        List<String> participantIds,
        List<String> playfieldIds
) {
}