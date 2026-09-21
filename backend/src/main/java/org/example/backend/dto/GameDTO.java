package org.example.backend.dto;

import lombok.Builder;
import lombok.With;
import org.example.backend.model.GameRound;
import org.example.backend.model.Pairing;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Builder
@With
public record GameDTO(
        String tournamentId,
        String playfieldId,
        int round,
        int position,
        int group,
        List<Pairing> pairings,
        List<GameRound> rounds
) {
}