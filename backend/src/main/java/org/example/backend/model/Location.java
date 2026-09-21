package org.example.backend.model;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("location")
@Builder
@With
public record Location(
        @Id
        String id,
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