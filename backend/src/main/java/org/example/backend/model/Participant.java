package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("participant")
@Builder
@With
public record Participant(
        @Id
        String id,
        String lastname,
        String firstname
) {
}