package org.example.backend.controller;

import org.bson.types.ObjectId;
import org.example.backend.model.Playfield;
import org.example.backend.repository.PlayfieldRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PlayfieldControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlayfieldRepo playfieldRepo;

    private static final ObjectId PLAYFIELD_ID = new ObjectId("507f1f77bcf86cd799439011");

    @Test
    void getAll_returnsAllPlayfields() throws Exception {
        // Given
        Playfield playfield = Playfield.builder().id(PLAYFIELD_ID).name("Dartscheibe 1").build();
        when(playfieldRepo.findAll()).thenReturn(List.of(playfield));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "name": "Dartscheibe 1" } ]
                """;

        // When & Then
        mockMvc.perform(get("/api/playfields").with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsPlayfield_whenExists() throws Exception {
        // Given
        Playfield playfield = Playfield.builder().id(PLAYFIELD_ID).name("Dartscheibe 1").build();
        when(playfieldRepo.findById(PLAYFIELD_ID)).thenReturn(Optional.of(playfield));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Dartscheibe 1" }
                """;

        // When & Then
        mockMvc.perform(get("/api/playfields/{id}", PLAYFIELD_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(playfieldRepo.findById(id)).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/playfields/{id}", id.toHexString()).with(oidcLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void create_returnsCreatedPlayfield() throws Exception {
        // Given
        Playfield saved = Playfield.builder().id(PLAYFIELD_ID).name("Dartscheibe 1").build();
        when(playfieldRepo.save(any(Playfield.class))).thenReturn(saved);

        String requestBody = """
                { "name": "Dartscheibe 1" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Dartscheibe 1" }
                """;

        // When & Then
        mockMvc.perform(post("/api/playfields").with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedPlayfield_whenExists() throws Exception {
        // Given
        Playfield updated = Playfield.builder().id(PLAYFIELD_ID).name("Dartscheibe neu").build();

        when(playfieldRepo.existsById(PLAYFIELD_ID)).thenReturn(true);
        when(playfieldRepo.save(any(Playfield.class))).thenReturn(updated);

        String requestBody = """
                { "name": "Dartscheibe neu" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Dartscheibe neu" }
                """;

        // When & Then
        mockMvc.perform(put("/api/playfields/{id}", PLAYFIELD_ID.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(playfieldRepo).save(argThat(p -> p.id().equals(PLAYFIELD_ID) && p.name().equals("Dartscheibe neu")));
    }

    @Test
    void update_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(playfieldRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "name": "Dartscheibe neu" }
                """;

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/playfields/{id}", id.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(playfieldRepo, never()).save(any());
    }

    @Test
    void delete_removesPlayfield() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/playfields/{id}", PLAYFIELD_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isNoContent());

        verify(playfieldRepo).deleteById(PLAYFIELD_ID);
    }
}