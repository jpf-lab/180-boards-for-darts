package org.example.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("participant")
public record Participant(
        @Id
        ObjectId id,
        String lastname,
        String firstname
) {
}