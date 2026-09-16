package org.example.backend.repository;

import org.bson.types.ObjectId;
import org.example.backend.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface GameRepo extends MongoRepository<Game, ObjectId> {

    List<Game> findByTournamentId(ObjectId tournamentId);

    List<Game> findByTournamentIdAndRound(ObjectId tournamentId, int round);

    List<Game> findByPlayfieldId(ObjectId playfieldId);

    @Query("{ 'pairings.participantId': ?0 }") //durchsuche das Array pairings, und für jedes Element darin, schau ins Feld participantId
    List<Game> findByParticipantId(ObjectId participantId);
}