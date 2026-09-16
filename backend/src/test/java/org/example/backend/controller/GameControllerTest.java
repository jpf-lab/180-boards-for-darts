package org.example.backend.controller;

import org.bson.types.ObjectId;
import org.example.backend.model.Game;
import org.example.backend.model.Pairing;
import org.example.backend.repository.GameRepo;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GameRepo gameRepo;

    private static final ObjectId GAME_ID = new ObjectId("507f1f77bcf86cd799439011");
    private static final ObjectId TOURNAMENT_ID = new ObjectId("507f1f77bcf86cd799439012");
    private static final ObjectId PLAYFIELD_ID = new ObjectId("507f1f77bcf86cd799439013");
    private static final ObjectId PARTICIPANT_ID = new ObjectId("507f1f77bcf86cd799439014");

    @Test
    void getAll_returnsAllGames() throws Exception {
        // Given
        Game game = Game.builder().id(GAME_ID).round(1).position(0).build();
        when(gameRepo.findAll()).thenReturn(List.of(game));

        String expectedJson = """
                [
                    { "id": "507f1f77bcf86cd799439011", "tournamentId": null, "playfieldId": null,
                      "round": 1, "position": 0, "group": 0, "pairings": null, "rounds": null }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/games").with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsGame_whenExists() throws Exception {
        // Given
        Game game = Game.builder().id(GAME_ID).round(1).position(0).build();
        when(gameRepo.findById(GAME_ID)).thenReturn(Optional.of(game));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "round": 1, "position": 0, "group": 0 }
                """;

        // When & Then
        mockMvc.perform(get("/api/games/{id}", GAME_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(gameRepo.findById(id)).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/games/{id}", id.toHexString()).with(oidcLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void getByTournamentId_withoutRound_returnsAllGamesOfTournament() throws Exception {
        // Given
        Game game = Game.builder().id(GAME_ID).tournamentId(TOURNAMENT_ID).round(1).build();
        when(gameRepo.findByTournamentId(TOURNAMENT_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                    { "id": "507f1f77bcf86cd799439011", "tournamentId": "507f1f77bcf86cd799439012", "round": 1 }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/games").param("tournamentId", TOURNAMENT_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(gameRepo).findByTournamentId(TOURNAMENT_ID);
        verify(gameRepo, never()).findByTournamentIdAndRound(any(), anyInt());
    }

    @Test
    void getByTournamentId_withRound_filtersOnRoundToo() throws Exception {
        // Given
        Game game = Game.builder().id(GAME_ID).tournamentId(TOURNAMENT_ID).round(2).build();
        when(gameRepo.findByTournamentIdAndRound(TOURNAMENT_ID, 2)).thenReturn(List.of(game));

        String expectedJson = """
                [
                    { "id": "507f1f77bcf86cd799439011", "tournamentId": "507f1f77bcf86cd799439012", "round": 2 }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/games")
                        .param("tournamentId", TOURNAMENT_ID.toHexString())
                        .param("round", "2")
                        .with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByPlayfieldId_returnsMatchingGames() throws Exception {
        // Given
        Game game = Game.builder().id(GAME_ID).playfieldId(PLAYFIELD_ID).build();
        when(gameRepo.findByPlayfieldId(PLAYFIELD_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                    { "id": "507f1f77bcf86cd799439011", "playfieldId": "507f1f77bcf86cd799439013" }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/games").param("playfieldId", PLAYFIELD_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByParticipantId_returnsMatchingGames() throws Exception {
        // Given
        Pairing pairing = Pairing.builder().participantId(PARTICIPANT_ID).team(0).teamOrder(0).build();
        Game game = Game.builder().id(GAME_ID).pairings(List.of(pairing)).build();
        when(gameRepo.findByParticipantId(PARTICIPANT_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                    { "id": "507f1f77bcf86cd799439011",
                      "pairings": [ { "participantId": "507f1f77bcf86cd799439014", "team": 0, "teamOrder": 0 } ] }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/games").param("participantId", PARTICIPANT_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void create_returnsCreatedGame() throws Exception {
        // Given
        Game saved = Game.builder().id(GAME_ID).round(1).position(0).build();
        when(gameRepo.save(any(Game.class))).thenReturn(saved);

        String requestBody = """
                { "round": 1, "position": 0 }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "round": 1, "position": 0, "group": 0 }
                """;

        // When & Then
        mockMvc.perform(post("/api/games").with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedGame_whenExists() throws Exception {
        // Given
        Game updated = Game.builder()
                .id(GAME_ID)
                .tournamentId(TOURNAMENT_ID)
                .playfieldId(PLAYFIELD_ID)
                .round(2)
                .position(3)
                .group(1)
                .pairings(List.of())
                .rounds(List.of())
                .build();

        when(gameRepo.existsById(GAME_ID)).thenReturn(true);
        when(gameRepo.save(any(Game.class))).thenReturn(updated);

        String requestBody = """
                {
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "playfieldId": "507f1f77bcf86cd799439013",
                    "round": 2,
                    "position": 3,
                    "group": 1,
                    "pairings": [],
                    "rounds": []
                }
                """;
        String expectedJson = """
                {
                    "id": "507f1f77bcf86cd799439011",
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "playfieldId": "507f1f77bcf86cd799439013",
                    "round": 2,
                    "position": 3,
                    "group": 1
                }
                """;

        // When & Then
        mockMvc.perform(put("/api/games/{id}", GAME_ID.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(gameRepo).save(argThat(g -> g.id().equals(GAME_ID) && g.round() == 2));
    }

    @Test
    void update_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(gameRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "round": 1, "position": 0 }
                """;

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/games/{id}", id.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(gameRepo, never()).save(any());
    }

    @Test
    void delete_removesGame() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/games/{id}", GAME_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isNoContent());

        verify(gameRepo).deleteById(GAME_ID);
    }
}