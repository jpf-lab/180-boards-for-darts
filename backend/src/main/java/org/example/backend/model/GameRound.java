package org.example.backend.model;

import lombok.Builder;
import lombok.With;

@Builder
@With
public record GameRound(
        int roundNumber,
        String startingPlayer,
        String winner
) {
}