package org.example.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oidcLogin;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AppUserRepo appUserRepo;

    private static final String USER_ID = "123";

    @Test
    void getMe_returnsOkAndDto_whenUserExists() throws Exception {
        // Given: ein existierender User wird im Repo gemockt
        AppUser appUser = AppUser.builder()
                .id(USER_ID)
                .username("user")
                .role(UserRole.ADMIN)
                .build();

        when(appUserRepo.findById(USER_ID)).thenReturn(Optional.of(appUser));

        String expectedJson = """
                {
                    "name": "user",
                    "role": "ADMIN"
                }
                """;

        // When: der authentifizierte User ruft /api/auth/me auf
        // Then: die Response ist 200 OK und enthält das erwartete AppUserDTO als JSON
        mockMvc.perform(get("/api/auth/me")
                        .with(oidcLogin()
                                .idToken(token -> token.claim("sub", USER_ID))
                                .userInfoToken(token -> token.claim("login", "user"))))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void getMe_throwsNoSuchElementException_whenUserDoesNotExist() {
        // Given: kein User mit dieser ID existiert im Repo
        when(appUserRepo.findById(USER_ID)).thenReturn(Optional.empty());

        // When: der authentifizierte User ruft /api/auth/me auf
        // Then: es wird eine NoSuchElementException geworfen (ungefangen, da kein ExceptionHandler existiert)
        Exception exception = assertThrows(Exception.class, () ->
                mockMvc.perform(get("/api/auth/me")
                        .with(oidcLogin()
                                .idToken(token -> token.claim("sub", USER_ID))
                                .userInfoToken(token -> token.claim("login", "user"))))
        );

        assertInstanceOf(NoSuchElementException.class, exception.getCause());
        assertEquals("User Not Found", exception.getCause().getMessage());
    }

    @Test
    void getMe_returnsUnauthorized_whenNotAuthenticated() throws Exception {
        // Given: kein authentifizierter User (kein oidcLogin())

        // When: /api/auth/me wird ohne Authentifizierung aufgerufen
        // Then: die Response ist 401 Unauthorized
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }
}