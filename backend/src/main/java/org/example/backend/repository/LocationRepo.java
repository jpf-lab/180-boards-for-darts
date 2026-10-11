package org.example.backend.repository;

import org.example.backend.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LocationRepo extends MongoRepository<Location, String> {

    @Query("{ $or: [ "
            + "{ name: { $regex: ?0, $options: 'i' } }, "
            + "{ street: { $regex: ?0, $options: 'i' } }, "
            + "{ number: { $regex: ?0, $options: 'i' } }, "
            + "{ city: { $regex: ?0, $options: 'i' } }, "
            + "{ postalcode: { $regex: ?0, $options: 'i' } }, "
            + "{ owner: { $regex: ?0, $options: 'i' } }, "
            + "{ contactPhone: { $regex: ?0, $options: 'i' } }, "
            + "{ contactMail: { $regex: ?0, $options: 'i' } }, "
            + "{ _id: ?1 } ] }")
    List<Location> searchByTerm(String regex, String id);
}