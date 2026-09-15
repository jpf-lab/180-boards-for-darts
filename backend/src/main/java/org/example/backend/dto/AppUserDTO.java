package org.example.backend.dto;

enum Role {
    USER("User"),
    ADMIN("Admin");

    public final String label;

    Role(String label) {
        this.label = label;
    }
}

public record AppUserDTO(
        String name,
        Role role
) {
}
