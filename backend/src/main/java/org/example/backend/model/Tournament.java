package org.example.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("tournament")
public record Tournament(
        @Id
        ObjectId id,
        String name,
        Instant datetime,
        ObjectId locationId,
        List<ObjectId> participantIds,
        List<ObjectId> playfieldIds
) {
}