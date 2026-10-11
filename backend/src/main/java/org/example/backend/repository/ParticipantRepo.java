package org.example.backend.repository;

import org.example.backend.model.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface ParticipantRepo extends MongoRepository<Participant, String> {

    @Query("{ $or: [ "
            + "{ firstname: { $regex: ?0, $options: 'i' } }, "
            + "{ lastname:  { $regex: ?0, $options: 'i' } }, "
            + "{ _id: ?1 } ] }")
    List<Participant> searchByToken(String regex, String id);
}