package org.example.backend.repository;

import org.example.backend.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface GameRepo extends MongoRepository<Game, String> {

    List<Game> findByTournamentId(String tournamentId);

    List<Game> findByTournamentIdAndRound(String tournamentId, int round);

    List<Game> findByPlayfieldId(String playfieldId);

    // Search the pairing array and check the participantId field of each element
    @Query("{ 'pairing.participantId': ?0 }")
    List<Game> findByParticipantId(String participantId);
}