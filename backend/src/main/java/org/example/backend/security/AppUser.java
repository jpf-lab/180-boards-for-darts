package org.example.backend.security;

import lombok.Builder;
import lombok.With;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("AppUsers")
@Builder
public record AppUser(
        String id,
        String username,
        UserRole role
) {
}