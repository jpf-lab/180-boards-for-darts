package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@With
@Builder
@Document("game")
public record Game(
        @Id
        ObjectId id,
        ObjectId tournamentId,
        ObjectId playfieldId,
        int round,
        int position,
        int group,
        List<Pairing> pairings,
        List<GameRound> rounds
) {
}