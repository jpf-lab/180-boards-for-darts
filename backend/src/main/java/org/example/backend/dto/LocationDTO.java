package org.example.backend.dto;

import lombok.Builder;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Builder
@With
public record LocationDTO(
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