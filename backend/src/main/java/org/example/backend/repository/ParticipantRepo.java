package org.example.backend.repository;

import org.example.backend.model.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ParticipantRepo extends MongoRepository<Participant, String> {
}