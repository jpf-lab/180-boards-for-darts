package org.example.backend.repository;

import org.bson.types.ObjectId;
import org.example.backend.model.Playfield;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlayfieldRepo extends MongoRepository<Playfield, ObjectId> {
}