package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;

@With
@Builder
public record GameRound(
        int roundNumber,
        ObjectId startingPlayer,
        ObjectId winner
) {
}