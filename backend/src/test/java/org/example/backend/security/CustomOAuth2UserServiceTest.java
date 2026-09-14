package org.example.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.client.RestOperations;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private AppUserRepo appUserRepo;

    @Mock
    private RestOperations restOperations;

    private CustomOAuth2UserService service;
    private OAuth2UserRequest userRequest;

    @BeforeEach
    void setUp() {
        service = new CustomOAuth2UserService(appUserRepo);
        service.setRestOperations(restOperations);

        ClientRegistration clientRegistration = ClientRegistration.withRegistrationId("github")
                .clientId("client-id")
                .clientSecret("client-secret")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .authorizationUri("https://github.com/login/oauth/authorize")
                .tokenUri("https://github.com/login/oauth/access_token")
                .userInfoUri("https://api.github.com/user")
                .userNameAttributeName("id")
                .scope("read:user")
                .build();

        OAuth2AccessToken accessToken = new OAuth2AccessToken(
                OAuth2AccessToken.TokenType.BEARER,
                "test-token",
                Instant.now(),
                Instant.now().plusSeconds(3600)
        );

        userRequest = new OAuth2UserRequest(clientRegistration, accessToken);

        // Simuliert die Antwort des OAuth2-Providers (statt echtem HTTP-Call)
        Map<String, Object> attributes = Map.of("id", "12345", "login", "octocat");
        ResponseEntity<Map<String, Object>> response = ResponseEntity.ok(attributes);

        when(restOperations.exchange(
                any(RequestEntity.class),
                any(ParameterizedTypeReference.class)))
                .thenReturn(response);
    }

    @Test
    void loadUser_existingUser_returnsUserWithStoredRole() {
        AppUser existingUser = new AppUser("12345", "user", "ADMIN");
        when(appUserRepo.findById("12345")).thenReturn(Optional.of(existingUser));

        OAuth2User result = service.loadUser(userRequest);

        assertThat(result.getName()).isEqualTo("12345");
        assertThat(result.getAuthorities())
                .extracting("authority")
                .containsExactly("ADMIN");
        verify(appUserRepo, never()).save(any());
    }

    @Test
    void loadUser_newUser_createsUserAndReturnsDefaultRole() {
        when(appUserRepo.findById("12345")).thenReturn(Optional.empty());

        OAuth2User result = service.loadUser(userRequest);

        assertThat(result.getName()).isEqualTo("12345");
        assertThat(result.getAuthorities())
                .extracting("authority")
                .containsExactly("USER"); // an eure tatsächliche Default-Rolle anpassen
        verify(appUserRepo).save(any(AppUser.class));
    }
}