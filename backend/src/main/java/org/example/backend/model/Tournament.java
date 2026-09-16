package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@With
@Builder
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