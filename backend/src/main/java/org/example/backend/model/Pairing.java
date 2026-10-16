package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Builder
@With
public record Pairing(
        @Field(targetType = FieldType.OBJECT_ID)
        String participantId
) {
}