package org.example.backend.repository;

import org.example.backend.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LocationRepo extends MongoRepository<Location, String> {
}