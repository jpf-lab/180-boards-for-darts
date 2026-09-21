package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("game")
@Builder
@With
public record Game(
        @Id
        String id,
        String tournamentId,
        String playfieldId,
        int round,
        int position,
        int group,
        List<Pairing> pairings,
        List<GameRound> rounds
) {
}