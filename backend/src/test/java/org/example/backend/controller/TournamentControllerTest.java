package org.example.backend.controller;

import org.example.backend.model.Tournament;
import org.example.backend.repository.TournamentRepo;
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
class TournamentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TournamentRepo tournamentRepo;

    private static final String TOURNAMENT_ID = "507f1f77bcf86cd799439011";
    private static final String LOCATION_ID = "507f1f77bcf86cd799439012";
    private static final String PARTICIPANT_ID = "507f1f77bcf86cd799439013";
    private static final String PLAYFIELD_ID = "507f1f77bcf86cd799439014";

    @Test
    void getAll_returnsAllTournaments() throws Exception {
        Tournament tournament = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1").build();
        when(tournamentRepo.findAll()).thenReturn(List.of(tournament));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "name": "turnier 1" } ]
                """;

        mockMvc.perform(get("/api/tournaments").with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsTournament_whenExists() throws Exception {
        Tournament tournament = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1").build();
        when(tournamentRepo.findById(TOURNAMENT_ID)).thenReturn(Optional.of(tournament));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "turnier 1" }
                """;

        mockMvc.perform(get("/api/tournaments/{id}", TOURNAMENT_ID).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(tournamentRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/tournaments/{id}", id).with(oidcLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void getByLocationId_returnsMatchingTournaments() throws Exception {
        Tournament tournament = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1").locationId(LOCATION_ID).build();
        when(tournamentRepo.findByLocationId(LOCATION_ID)).thenReturn(List.of(tournament));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "name": "turnier 1", "locationId": "507f1f77bcf86cd799439012" } ]
                """;

        mockMvc.perform(get("/api/tournaments").param("locationId", LOCATION_ID).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByParticipantId_returnsMatchingTournaments() throws Exception {
        Tournament tournament = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1")
                .participantIds(List.of(PARTICIPANT_ID)).build();
        when(tournamentRepo.findByParticipantIdsContaining(PARTICIPANT_ID)).thenReturn(List.of(tournament));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "name": "turnier 1", "participantIds": ["507f1f77bcf86cd799439013"] } ]
                """;

        mockMvc.perform(get("/api/tournaments").param("participantId", PARTICIPANT_ID).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByPlayfieldId_returnsMatchingTournaments() throws Exception {
        Tournament tournament = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1")
                .playfieldIds(List.of(PLAYFIELD_ID)).build();
        when(tournamentRepo.findByPlayfieldIdsContaining(PLAYFIELD_ID)).thenReturn(List.of(tournament));

        String expectedJson = """
                [ { "id": "507f1f77bcf86cd799439011", "name": "turnier 1", "playfieldIds": ["507f1f77bcf86cd799439014"] } ]
                """;

        mockMvc.perform(get("/api/tournaments").param("playfieldId", PLAYFIELD_ID).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void create_returnsCreatedTournament() throws Exception {
        Tournament saved = Tournament.builder().id(TOURNAMENT_ID).name("turnier 1").build();
        when(tournamentRepo.save(any(Tournament.class))).thenReturn(saved);

        String requestBody = """
                { "name": "turnier 1" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "turnier 1" }
                """;

        mockMvc.perform(post("/api/tournaments").with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedTournament_whenExists() throws Exception {
        Tournament updated = Tournament.builder().id(TOURNAMENT_ID).name("neuer name").build();

        when(tournamentRepo.existsById(TOURNAMENT_ID)).thenReturn(true);
        when(tournamentRepo.save(any(Tournament.class))).thenReturn(updated);

        String requestBody = """
                { "name": "neuer name" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "neuer name" }
                """;

        mockMvc.perform(put("/api/tournaments/{id}", TOURNAMENT_ID).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(tournamentRepo).save(argThat(t -> t.id().equals(TOURNAMENT_ID) && t.name().equals("neuer name")));
    }

    @Test
    void update_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(tournamentRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "name": "neuer name" }
                """;

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/tournaments/{id}", id).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(tournamentRepo, never()).save(any());
    }

    @Test
    void delete_removesTournament() throws Exception {
        mockMvc.perform(delete("/api/tournaments/{id}", TOURNAMENT_ID).with(oidcLogin()))
                .andExpect(status().isNoContent());

        verify(tournamentRepo).deleteById(TOURNAMENT_ID);
    }
}