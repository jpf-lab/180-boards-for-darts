package org.example.backend.security;

public record AppUserDTO(
        String name,
        UserRole role
) {
}
