package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;

@With
@Builder
public record Pairing(
        ObjectId participantId,
        int team,
        int teamOrder
) {
}