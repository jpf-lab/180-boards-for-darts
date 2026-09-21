package org.example.backend.repository;

import org.example.backend.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TournamentRepo extends MongoRepository<Tournament, String> {

    List<Tournament> findByLocationId(String locationId);

    List<Tournament> findByParticipantIdsContaining(String participantId);

    List<Tournament> findByPlayfieldIdsContaining(String playfieldId);
}