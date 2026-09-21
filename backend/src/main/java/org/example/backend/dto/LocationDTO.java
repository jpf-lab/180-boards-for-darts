package org.example.backend.dto;

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