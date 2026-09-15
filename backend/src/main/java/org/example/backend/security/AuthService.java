package org.example.backend.security;

import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class AuthService {

    private final AppUserRepo appUserRepo;

    public  AuthService(AppUserRepo appUserRepo) {
        this.appUserRepo = appUserRepo;
    }

    public AppUserDTO getAppUserById(String id){

        AppUser appUser = appUserRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User Not Found"));

        return new AppUserDTO(
                appUser.username(),
                appUser.role()
        );
    }
}
