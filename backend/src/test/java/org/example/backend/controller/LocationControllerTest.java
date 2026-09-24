package org.example.backend.controller;

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

import static org.example.backend.security.TestSecurity.adminLogin;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
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

    private static final String LOCATION_ID = "507f1f77bcf86cd799439011";

    @Test
    void getAll_returnsAllLocations() throws Exception {
        Location location = Location.builder()
                .id(LOCATION_ID)
                .name("Testort")
                .street("Teststraße")
                .number("1")
                .city("Teststadt")
                .postalcode("12345")
                .owner("Testbesitzer")
                .contactPhone(null)
                .contactMail(null)
                .build();

        when(locationRepo.findAll()).thenReturn(List.of(location));

        String expectedJson = """
                [
                    {
                        "id": "507f1f77bcf86cd799439011",
                        "name": "Testort",
                        "street": "Teststraße",
                        "number": "1",
                        "city": "Teststadt",
                        "postalcode": "12345",
                        "owner": "Testbesitzer",
                        "contactPhone": null,
                        "contactMail": null
                    }
                ]
                """;

        mockMvc.perform(get("/api/locations").with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_returnsLocation_whenExists() throws Exception {
        Location location = Location.builder().id(LOCATION_ID).name("Testort").city("Teststadt").build();
        when(locationRepo.findById(LOCATION_ID)).thenReturn(Optional.of(location));

        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Testort", "city": "Teststadt" }
                """;

        mockMvc.perform(get("/api/locations/{id}", LOCATION_ID).with(adminLogin()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getById_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(locationRepo.findById(id)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/locations/{id}", id).with(adminLogin())));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
    }

    @Test
    void create_returnsCreatedLocation() throws Exception {
        Location saved = Location.builder().id(LOCATION_ID).name("Testort").city("Teststadt").build();
        when(locationRepo.save(any(Location.class))).thenReturn(saved);

        String requestBody = """
                { "name": "Testort", "city": "Teststadt" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Testort", "city": "Teststadt" }
                """;

        mockMvc.perform(post("/api/locations").with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void update_returnsUpdatedLocation_whenExists() throws Exception {
        Location updated = Location.builder().id(LOCATION_ID).name("Neuer Testort").city("Teststadt").build();

        when(locationRepo.existsById(LOCATION_ID)).thenReturn(true);
        when(locationRepo.save(any(Location.class))).thenReturn(updated);

        String requestBody = """
                { "name": "Neuer Testort", "city": "Teststadt" }
                """;
        String expectedJson = """
                { "id": "507f1f77bcf86cd799439011", "name": "Neuer Testort", "city": "Teststadt" }
                """;

        mockMvc.perform(put("/api/locations/{id}", LOCATION_ID).with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        verify(locationRepo).save(argThat(l -> l.id().equals(LOCATION_ID) && l.name().equals("Neuer Testort")));
    }

    @Test
    void update_throwsException_whenNotFound() {
        String id = "000000000000000000000000";
        when(locationRepo.existsById(id)).thenReturn(false);

        String requestBody = """
                { "name": "Neuer Testort" }
                """;

        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(put("/api/locations/{id}", id).with(adminLogin())
                        .contentType("application/json")
                        .content(requestBody)));

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        verify(locationRepo, never()).save(any());
    }

    @Test
    void delete_removesLocation() throws Exception {
        mockMvc.perform(delete("/api/locations/{id}", LOCATION_ID).with(adminLogin()))
                .andExpect(status().isNoContent());

        verify(locationRepo).deleteById(LOCATION_ID);
    }
}