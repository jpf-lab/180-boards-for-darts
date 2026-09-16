package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Builder
@Document("playfield")
public record Playfield(
        @Id
        ObjectId id,
        String name
) {
}