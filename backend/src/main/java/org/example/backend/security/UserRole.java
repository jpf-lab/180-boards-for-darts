package org.example.backend.security;


public enum UserRole {
    USER("User"),
    ADMIN("Admin");

    public final String label;

    UserRole(String label) {
        this.label = label;
    }
}
