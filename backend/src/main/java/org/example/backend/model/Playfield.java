package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("playfield")
@Builder
@With
public record Playfield(
        @Id
        String id,
        String name
) {
}