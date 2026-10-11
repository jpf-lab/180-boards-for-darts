package org.example.backend.service;

import org.example.backend.model.Participant;
import org.example.backend.repository.ParticipantRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParticipantServiceTest {

    @Mock
    private ParticipantRepo participantRepo;

    @InjectMocks
    private ParticipantService participantService;

    private final Participant max = Participant.builder().id("1").firstname("Max").lastname("Mustermann").build();
    private final Participant erika = Participant.builder().id("2").firstname("Erika").lastname("Musterfrau").build();

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {" ", "\t"})
    void search_returnsEmptyList_whenQueryIsBlank(String query) {
        assertTrue(participantService.search(query).isEmpty());
        verifyNoInteractions(participantRepo);
    }

    @Test
    void search_singleToken_returnsCandidates() {
        when(participantRepo.searchByToken(Pattern.quote("muster"), "muster"))
                .thenReturn(List.of(max, erika));

        assertEquals(List.of(max, erika), participantService.search("muster"));
    }

    @Test
    void search_usesLongestTokenForDatabaseQuery() {
        when(participantRepo.searchByToken(Pattern.quote("mus"), "mus"))
                .thenReturn(List.of(max, erika));

        assertEquals(List.of(max, erika), participantService.search("a mus"));
        verify(participantRepo).searchByToken(Pattern.quote("mus"), "mus");
    }

    @Test
    void search_filtersCandidatesByAllTokens() {
        when(participantRepo.searchByToken(Pattern.quote("mus"), "mus"))
                .thenReturn(List.of(max, erika));

        assertEquals(List.of(max), participantService.search("ma mus"));
    }

    @Test
    void search_tokensMayMatchDifferentFields() {
        when(participantRepo.searchByToken(Pattern.quote("must"), "must"))
                .thenReturn(List.of(max, erika));

        assertEquals(List.of(max), participantService.search("max must"));
    }

    @Test
    void search_isCaseInsensitive() {
        when(participantRepo.searchByToken(Pattern.quote("MUSTER"), "MUSTER"))
                .thenReturn(List.of(max));

        assertEquals(List.of(max), participantService.search("MUSTER"));
    }

    @Test
    void search_matchesExactId() {
        String id = "6ab4f3765b301ddd296840d0";
        Participant withId = Participant.builder().id(id).firstname("John").lastname("Doe").build();
        when(participantRepo.searchByToken(Pattern.quote(id), id)).thenReturn(List.of(withId));

        assertEquals(List.of(withId), participantService.search(id));
    }

    @Test
    void search_handlesNullNames() {
        Participant incomplete = Participant.builder().id("5").firstname(null).lastname("Mustermann").build();
        when(participantRepo.searchByToken(Pattern.quote("muster"), "muster"))
                .thenReturn(List.of(incomplete));

        assertEquals(List.of(incomplete), participantService.search("muster"));
    }

    @Test
    void search_returnsEmptyList_whenNoCandidateMatchesAllTokens() {
        when(participantRepo.searchByToken(Pattern.quote("muster"), "muster"))
                .thenReturn(List.of(max, erika));

        assertTrue(participantService.search("muster jane").isEmpty());
    }
}