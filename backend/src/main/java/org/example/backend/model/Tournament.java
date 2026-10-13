package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

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
        @Field(targetType = FieldType.OBJECT_ID)
        String locationId,
        @Field(targetType = FieldType.OBJECT_ID)
        List<String> participantIds,
        @Field(targetType = FieldType.OBJECT_ID)
        List<String> playfieldIds
) {
}