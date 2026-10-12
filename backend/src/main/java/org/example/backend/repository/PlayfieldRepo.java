package org.example.backend.repository;

import org.example.backend.model.Playfield;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface PlayfieldRepo extends MongoRepository<Playfield, String> {

    @Query("{ $or: [ { name: { $regex: ?0, $options: 'i' } }, { _id: ?1 } ] }")
    List<Playfield> searchByTerm(String regex, String id);
}