package org.example.backend.dto;

import lombok.Builder;
import lombok.With;

@Builder
@With
public record ParticipantDTO(
        String lastname,
        String firstname
) {
}