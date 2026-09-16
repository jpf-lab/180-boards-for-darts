package org.example.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

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