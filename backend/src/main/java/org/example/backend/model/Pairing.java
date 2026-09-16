package org.example.backend.model;

import org.bson.types.ObjectId;

public record Pairing(
        ObjectId participantId,
        int team,
        int teamOrder
) {
}