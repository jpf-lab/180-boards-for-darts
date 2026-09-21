package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("tournament")
@Builder
@With
public record Tournament(
        @Id
        String id,
        String name,
        Instant datetime,
        String locationId,
        List<String> participantIds,
        List<String> playfieldIds
) {
}