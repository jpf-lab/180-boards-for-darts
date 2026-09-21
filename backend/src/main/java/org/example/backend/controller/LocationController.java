package org.example.backend.controller;

import org.example.backend.dto.LocationDTO;
import org.example.backend.model.Location;
import org.example.backend.repository.LocationRepo;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationRepo locationRepo;

    public LocationController(LocationRepo locationRepo) {
        this.locationRepo = locationRepo;
    }

    @GetMapping
    public List<Location> getAll() {
        return locationRepo.findAll();
    }

    @GetMapping("/{id}")
    public Location getById(@PathVariable String id) {
        return locationRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Location not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Location create(@RequestBody LocationDTO location) {
        return locationRepo.save(Location.builder()
                .id(null)
                .name(location.name())
                .street(location.street())
                .number(location.number())
                .city(location.city())
                .postalcode(location.postalcode())
                .owner(location.owner())
                .contactPhone(location.contactPhone())
                .contactMail(location.contactMail())
                .build()
        );
    }

    @PutMapping("/{id}")
    public Location update(@PathVariable String id, @RequestBody LocationDTO location) {
        if (!locationRepo.existsById(id)) {
            throw new NoSuchElementException("Location not found");
        }
        return locationRepo.save(Location.builder()
                .id(id)
                .name(location.name())
                .street(location.street())
                .number(location.number())
                .city(location.city())
                .postalcode(location.postalcode())
                .owner(location.owner())
                .contactPhone(location.contactPhone())
                .contactMail(location.contactMail())
                .build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        locationRepo.deleteById(id);
    }
}