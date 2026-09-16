package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@With
@Builder
@Document("participant")
public record Participant(
        @Id
        ObjectId id,
        String lastname,
        String firstname
) {
}