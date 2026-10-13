package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Builder
@With
public record GameRound(
        @Field(targetType = FieldType.OBJECT_ID)
        String startingPlayer,
        @Field(targetType = FieldType.OBJECT_ID)
        String winner
) {
}