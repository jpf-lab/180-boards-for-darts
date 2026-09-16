package org.example.backend.model;

import org.bson.types.ObjectId;

public record GameRound(
        int roundNumber,
        ObjectId startingPlayer,
        ObjectId winner
) {
}