package org.example.backend.repository;

import org.bson.types.ObjectId;
import org.example.backend.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LocationRepo extends MongoRepository<Location, ObjectId> {
}