package org.example.backend.controller;

import org.bson.types.ObjectId;
import org.example.backend.model.Location;
import org.example.backend.repository.LocationRepo;
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
class LocationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LocationRepo locationRepo;

    private static final ObjectId LOCATION_ID = new ObjectId("507f1f77bcf86cd799439011");

    @Test
    void getAll_returnsAllLocations() throws Exception {
        // Given
        Location location = Location.builder()
                .id(LOCATION_ID)
                .name("Turnier 1")
                .street("Nideggenerstraße")
                .number("1")
                .city("Zülpich")
                .postalcode("53909")
                .owner("J-P")
                .contactPhone(225281881)
                .contactMail("a@b.de")
                .build();

        when(locationRepo.findAll()).thenReturn(List.of(location));

        String expectedJson = """
                [
                    {
                        "id": "507f1f77bcf86cd799439011",
                        "name": "Turnier 1",
                        "street": "Nideggenerstraße",
                        "number": "1",
                        "city": "Zülpich",
                        "postalcode": "53909",
                        "owner": "J-P",
                        "contactPhone": 225281881,
                        "contactMail": "a@b.de"
                    }
                ]
                """;

        // When & Then
        mockMvc.perform(get("/api/locations").with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsLocation_whenExists() throws Exception {
        // Given
        Location location = Location.builder().id(LOCATION_ID).name("Turnier 1").city("Zülpich").build();
        when(locationRepo.findById(LOCATION_ID)).thenReturn(Optional.of(location));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Turnier 1", "city": "Zülpich" }
                """;

        // When & Then
        mockMvc.perform(get("/api/locations/{id}", LOCATION_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(locationRepo.findById(id)).thenReturn(Optional.empty());

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/locations/{id}", id.toHexString()).with(oidcLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void create_returnsCreatedLocation() throws Exception {
        // Given
        Location saved = Location.builder().id(LOCATION_ID).name("Turnier 1").city("Zülpich").build();
        when(locationRepo.save(any(Location.class))).thenReturn(saved);

        String requestBody = """
                {
                    "name": "Turnier 1",
                    "city": "Zülpich"
                }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Turnier 1", "city": "Zülpich" }
                """;

        // When & Then
        mockMvc.perform(post("/api/locations").with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedLocation_whenExists() throws Exception {
        // Given
        Location updated = Location.builder().id(LOCATION_ID).name("Neuer Name").city("Zülpich").build();

        when(locationRepo.existsById(LOCATION_ID)).thenReturn(true);
        when(locationRepo.save(any(Location.class))).thenReturn(updated);

        String requestBody = """
                {
                    "name": "Neuer Name",
                    "city": "Zülpich"
                }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Neuer Name", "city": "Zülpich" }
                """;

        // When & Then
        mockMvc.perform(put("/api/locations/{id}", LOCATION_ID.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(locationRepo).save(argThat(l -> l.id().equals(LOCATION_ID) && l.name().equals("Neuer Name")));
    }

    @Test
    void update_throwsException_whenNotFound() {
        // Given
        ObjectId id = new ObjectId();
        when(locationRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "name": "Neuer Name" }
                """;

        // When & Then
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/locations/{id}", id.toHexString()).with(oidcLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(locationRepo, never()).save(any());
    }

    @Test
    void delete_removesLocation() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/locations/{id}", LOCATION_ID.toHexString()).with(oidcLogin()))
                .andExpect(status().isNoContent());

        verify(locationRepo).deleteById(LOCATION_ID);
    }
}