package org.example.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("playfield")
public record Playfield(
        @Id
        ObjectId id,
        String name
) {
}