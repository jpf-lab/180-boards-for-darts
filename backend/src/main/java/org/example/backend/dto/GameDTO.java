package org.example.backend.dto;

import org.example.backend.model.GameRound;
import org.example.backend.model.Pairing;

import java.util.List;

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