package org.example.backend.model;

import lombok.Builder;
import lombok.With;

@Builder
@With
public record Pairing(
        String participantId,
        Integer team,
        Integer teamOrder
) {
}