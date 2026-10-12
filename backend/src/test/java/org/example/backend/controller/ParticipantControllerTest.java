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
import java.util.regex.Pattern;

import static org.example.backend.security.TestSecurity.adminLogin;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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

        mockMvc.perform(get("/api/participants").with(adminLogin()))
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

        mockMvc.perform(get("/api/participants/{id}", PARTICIPANT_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(participantRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/participants/{id}", id).with(adminLogin())));

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

        mockMvc.perform(post("/api/participants").with(adminLogin())
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

        mockMvc.perform(put("/api/participants/{id}", PARTICIPANT_ID).with(adminLogin())
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
                mockMvc.perform(put("/api/participants/{id}", id).with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(participantRepo, never()).save(any());
    }

    @Test
    void delete_removesParticipant() throws Exception {
        mockMvc.perform(delete("/api/participants/{id}", PARTICIPANT_ID).with(adminLogin()))
                .andExpect(status().isNoContent());

        verify(participantRepo).deleteById(PARTICIPANT_ID);
    }

    @Test
    void search_returnsMatchingParticipants() throws Exception {
        Participant max = Participant.builder().id(PARTICIPANT_ID).firstname("Max").lastname("Mustermann").build();
        Participant erika = Participant.builder().id("507f1f77bcf86cd799439012").firstname("Erika").lastname("Musterfrau").build();
        when(participantRepo.searchByToken(Pattern.quote("muster"), "muster"))
                .thenReturn(List.of(max, erika));

        mockMvc.perform(get("/api/participants/search").param("query", "muster").with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].firstname").value("Max"))
                .andExpect(jsonPath("$[1].firstname").value("Erika"));
    }

    @Test
    void search_filtersByAllTokens() throws Exception {
        Participant max = Participant.builder().id(PARTICIPANT_ID).firstname("Max").lastname("Mustermann").build();
        Participant erika = Participant.builder().id("507f1f77bcf86cd799439012").firstname("Erika").lastname("Musterfrau").build();
        // Das Repo wird nur mit dem längsten Token "mus" befragt, "ma" filtert der Service
        when(participantRepo.searchByToken(Pattern.quote("mus"), "mus"))
                .thenReturn(List.of(max, erika));

        mockMvc.perform(get("/api/participants/search").param("query", "ma mus").with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].lastname").value("Mustermann"));
    }

    @Test
    void search_returnsEmptyList_whenQueryIsBlank() throws Exception {
        mockMvc.perform(get("/api/participants/search").param("query", "   ").with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(participantRepo, never()).searchByToken(any(), any());
    }

    @Test
    void search_returnsBadRequest_whenQueryParamIsMissing() throws Exception {
        mockMvc.perform(get("/api/participants/search").with(adminLogin()))
                .andExpect(status().isBadRequest());
    }
}