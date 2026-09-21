package org.example.backend.dto;

import lombok.Builder;
import lombok.With;

@Builder
@With
public record PlayfieldDTO(
        String name
) {
}