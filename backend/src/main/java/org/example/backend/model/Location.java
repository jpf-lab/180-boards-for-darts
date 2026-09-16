package org.example.backend.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("location")
public record Location(
        @Id
        ObjectId id,
        String name,
        String street,
        String number,
        String city,
        String postalcode,
        String owner,
        Integer contactPhone,
        String contactMail
) {
}