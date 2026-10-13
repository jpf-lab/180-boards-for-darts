package org.example.backend.controller;

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

import static org.example.backend.security.TestSecurity.adminLogin;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;
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

    private static final String GAME_ID = "507f1f77bcf86cd799439011";
    private static final String TOURNAMENT_ID = "507f1f77bcf86cd799439012";
    private static final String PLAYFIELD_ID = "507f1f77bcf86cd799439013";
    private static final String PARTICIPANT_ID = "507f1f77bcf86cd799439014";
    private static final String OPPONENT_ID = "507f1f77bcf86cd799439015";

    @Test
    void getAll_returnsAllGames() throws Exception {
        Game game = Game.builder()
                .id(GAME_ID)
                .round(1)
                .position(0)
                .group("A")
                .build();
        when(gameRepo.findAll()).thenReturn(List.of(game));

        String expectedJson = """
                [
                    {
                      "id": "507f1f77bcf86cd799439011",
                      "tournamentId": null,
                      "playfieldId": null,
                      "round": 1,
                      "position": 0,
                      "group": "A",
                      "pairing": null,
                      "game_round": null
                    }
                ]
                """;

        mockMvc.perform(get("/api/games").with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsGame_whenExists() throws Exception {
        Game game = Game.builder()
                .id(GAME_ID)
                .round(1)
                .position(0)
                .group("A")
                .build();
        when(gameRepo.findById(GAME_ID)).thenReturn(Optional.of(game));

        String expectedJson = """
                {
                  "id": "507f1f77bcf86cd799439011",
                  "round": 1,
                  "position": 0,
                  "group": "A"
                }
                """;

        mockMvc.perform(get("/api/games/{id}", GAME_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(gameRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/games/{id}", id).with(adminLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void getByTournamentId_withoutRound_returnsAllGamesOfTournament() throws Exception {
        Game game = Game.builder()
                .id(GAME_ID)
                .tournamentId(TOURNAMENT_ID)
                .round(1)
                .build();
        when(gameRepo.findByTournamentId(TOURNAMENT_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                  {
                    "id": "507f1f77bcf86cd799439011",
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "round": 1
                  }
                ]
                """;

        mockMvc.perform(get("/api/games").param("tournamentId", TOURNAMENT_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(gameRepo).findByTournamentId(TOURNAMENT_ID);
        verify(gameRepo, never()).findByTournamentIdAndRound(any(), anyInt());
    }

    @Test
    void getByTournamentId_withRound_filtersOnRoundToo() throws Exception {
        Game game = Game.builder()
                .id(GAME_ID)
                .tournamentId(TOURNAMENT_ID)
                .round(2)
                .build();
        when(gameRepo.findByTournamentIdAndRound(TOURNAMENT_ID, 2)).thenReturn(List.of(game));

        String expectedJson = """
                [
                  {
                    "id": "507f1f77bcf86cd799439011",
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "round": 2
                  }
                ]
                """;

        mockMvc.perform(get("/api/games")
                        .param("tournamentId", TOURNAMENT_ID)
                        .param("round", "2")
                        .with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByPlayfieldId_returnsMatchingGames() throws Exception {
        Game game = Game.builder()
                .id(GAME_ID)
                .playfieldId(PLAYFIELD_ID)
                .build();
        when(gameRepo.findByPlayfieldId(PLAYFIELD_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                  {
                    "id": "507f1f77bcf86cd799439011",
                    "playfieldId": "507f1f77bcf86cd799439013"
                  }
                ]
                """;

        mockMvc.perform(get("/api/games").param("playfieldId", PLAYFIELD_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getByParticipantId_returnsMatchingGames() throws Exception {
        Pairing pairing = Pairing.builder()
                .participantId(PARTICIPANT_ID)
                .build();
        Game game = Game.builder()
                .id(GAME_ID)
                .pairing(List.of(pairing))
                .build();
        when(gameRepo.findByParticipantId(PARTICIPANT_ID)).thenReturn(List.of(game));

        String expectedJson = """
                [
                  {
                    "id": "507f1f77bcf86cd799439011",
                    "pairing": [
                      {
                        "participantId": "507f1f77bcf86cd799439014"
                      }
                    ]
                  }
                ]
                """;

        mockMvc.perform(get("/api/games").param("participantId", PARTICIPANT_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void create_returnsCreatedGame() throws Exception {
        Game saved = Game.builder()
                .id(GAME_ID)
                .round(1)
                .position(0)
                .group("A")
                .build();
        when(gameRepo.save(any(Game.class))).thenReturn(saved);

        String requestBody = """
                {
                    "round": 1,
                    "position": 0,
                    "group": "A"
                }
                """;
        String expectedJson = """
                {
                  "id": "507f1f77bcf86cd799439011",
                  "round": 1,
                  "position": 0,
                  "group": "A"
                }
                """;

        mockMvc.perform(post("/api/games").with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void create_mapsPairingAndGameRoundFromRequest() throws Exception {
        Game saved = Game.builder().id(GAME_ID).group("A").build();
        when(gameRepo.save(any(Game.class))).thenReturn(saved);

        String requestBody = """
                {
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "playfieldId": "507f1f77bcf86cd799439013",
                    "round": 1,
                    "position": 1,
                    "group": "A",
                    "pairing": [
                        { "participantId": "507f1f77bcf86cd799439014" },
                        { "participantId": "507f1f77bcf86cd799439015" }
                    ],
                    "game_round": [
                        {
                            "startingPlayer": "507f1f77bcf86cd799439014",
                            "winner": "507f1f77bcf86cd799439014"
                        }
                    ]
                }
                """;

        mockMvc.perform(post("/api/games").with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated());

        verify(gameRepo).save(argThat(g ->
                g.id() == null
                        && "A".equals(g.group())
                        && g.pairing().size() == 2
                        && PARTICIPANT_ID.equals(g.pairing().get(0).participantId())
                        && OPPONENT_ID.equals(g.pairing().get(1).participantId())
                        && g.game_round().size() == 1
                        && PARTICIPANT_ID.equals(g.game_round().getFirst().startingPlayer())
                        && PARTICIPANT_ID.equals(g.game_round().getFirst().winner())));
    }

    @Test
    void update_returnsUpdatedGame_whenExists() throws Exception {
        Game updated = Game.builder()
                .id(GAME_ID)
                .tournamentId(TOURNAMENT_ID)
                .playfieldId(PLAYFIELD_ID)
                .round(2)
                .position(3)
                .group("B")
                .pairing(List.of())
                .game_round(List.of())
                .build();

        when(gameRepo.existsById(GAME_ID)).thenReturn(true);
        when(gameRepo.save(any(Game.class))).thenReturn(updated);

        String requestBody = """
                {
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "playfieldId": "507f1f77bcf86cd799439013",
                    "round": 2,
                    "position": 3,
                    "group": "B",
                    "pairing": [],
                    "game_round": []
                }
                """;
        String expectedJson = """
                {
                    "id": "507f1f77bcf86cd799439011",
                    "tournamentId": "507f1f77bcf86cd799439012",
                    "playfieldId": "507f1f77bcf86cd799439013",
                    "round": 2,
                    "position": 3,
                    "group": "B",
                    "pairing": [],
                    "game_round": []
                }
                """;

        mockMvc.perform(put("/api/games/{id}", GAME_ID).with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(gameRepo).save(argThat(g ->
                g.id().equals(GAME_ID) && g.round() == 2 && "B".equals(g.group())));
    }

    @Test
    void update_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(gameRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                {
                    "round": 1,
                    "position": 0,
                    "group": "A"
                }
                """;

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/games/{id}", id).with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(gameRepo, never()).save(any());
    }

    @Test
    void delete_removesGame() throws Exception {
        mockMvc.perform(delete("/api/games/{id}", GAME_ID).with(adminLogin()))
                .andExpect(status().isNoContent());

        verify(gameRepo).deleteById(GAME_ID);
    }
}