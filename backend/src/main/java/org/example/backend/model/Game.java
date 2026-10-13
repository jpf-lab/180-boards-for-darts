package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;

@Document("game")
@Builder
@With
public record Game(
        @Id
        String id,
        @Field(targetType = FieldType.OBJECT_ID)
        String tournamentId,
        @Field(targetType = FieldType.OBJECT_ID)
        String playfieldId,
        int round,
        int position,
        String group,
        List<Pairing> pairing,
        List<GameRound> game_round
) {
}