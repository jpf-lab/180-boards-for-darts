package org.example.backend.controller;

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
    public Location create(@RequestBody Location location) {
        return locationRepo.save(location);
    }

    @PutMapping("/{id}")
    public Location update(@PathVariable String id, @RequestBody Location location) {
        if (!locationRepo.existsById(id)) {
            throw new NoSuchElementException("Location not found");
        }
        return locationRepo.save(location.withId(id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        locationRepo.deleteById(id);
    }
}