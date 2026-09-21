package org.example.backend.controller;

import org.example.backend.model.Participant;
import org.example.backend.repository.ParticipantRepo;
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
class ParticipantControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ParticipantRepo participantRepo;

    private static final String PARTICIPANT_ID = "507f1f77bcf86cd799439011";

    @Test
    void getAll_returnsAllParticipants() throws Exception {
        Participant participant = Participant.builder().id(PARTICIPANT_ID).lastname("Nachname 1").firstname("Max 1").build();
        when(participantRepo.findAll()).thenReturn(List.of(participant));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "lastname": "Nachname 1", "firstname": "Max 1" } ]
                """;

        mockMvc.perform(get("/api/participants").with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsParticipant_whenExists() throws Exception {
        Participant participant = Participant.builder().id(PARTICIPANT_ID).lastname("Nachname 1").firstname("Max 1").build();
        when(participantRepo.findById(PARTICIPANT_ID)).thenReturn(Optional.of(participant));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "lastname": "Nachname 1", "firstname": "Max 1" }
                """;

        mockMvc.perform(get("/api/participants/{id}", PARTICIPANT_ID).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(participantRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/participants/{id}", id).with(oidcLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void create_returnsCreatedParticipant() throws Exception {
        Participant saved = Participant.builder().id(PARTICIPANT_ID).lastname("Nachname 1").firstname("Max 1").build();
        when(participantRepo.save(any(Participant.class))).thenReturn(saved);

        String requestBody = """
                { "lastname": "Nachname 1", "firstname": "Max 1" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "lastname": "Nachname 1", "firstname": "Max 1" }
                """;

        mockMvc.perform(post("/api/participants").with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedParticipant_whenExists() throws Exception {
        Participant updated = Participant.builder().id(PARTICIPANT_ID).lastname("Neuer Nachname").firstname("Max 1").build();

        when(participantRepo.existsById(PARTICIPANT_ID)).thenReturn(true);
        when(participantRepo.save(any(Participant.class))).thenReturn(updated);

        String requestBody = """
                { "lastname": "Neuer Nachname", "firstname": "Max 1" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "lastname": "Neuer Nachname", "firstname": "Max 1" }
                """;

        mockMvc.perform(put("/api/participants/{id}", PARTICIPANT_ID).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(participantRepo).save(argThat(p -> p.id().equals(PARTICIPANT_ID) && p.lastname().equals("Neuer Nachname")));
    }

    @Test
    void update_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(participantRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "lastname": "Neuer Nachname", "firstname": "Max 1" }
                """;

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/participants/{id}", id).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(participantRepo, never()).save(any());
    }

    @Test
    void delete_removesParticipant() throws Exception {
        mockMvc.perform(delete("/api/participants/{id}", PARTICIPANT_ID).with(oidcLogin()))
                .andExpect(status().isNoContent());

        verify(participantRepo).deleteById(PARTICIPANT_ID);
    }
}