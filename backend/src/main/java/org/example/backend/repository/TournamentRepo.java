package org.example.backend.repository;

import org.bson.types.ObjectId;
import org.example.backend.model.Tournament;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TournamentRepo extends MongoRepository<Tournament, ObjectId> {

    List<Tournament> findByLocationId(ObjectId locationId);

    List<Tournament> findByParticipantIdsContaining(ObjectId participantId);

    List<Tournament> findByPlayfieldIdsContaining(ObjectId playfieldId);
}