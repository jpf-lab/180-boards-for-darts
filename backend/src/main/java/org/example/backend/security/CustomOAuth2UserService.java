package org.example.backend.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final AppUserRepo appUserRepo;

    public CustomOAuth2UserService(AppUserRepo appUserRepo) {
        this.appUserRepo = appUserRepo;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        AppUser user = appUserRepo.findById(oAuth2User.getName())
                .orElseGet(() -> createUser(oAuth2User));

        return new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(user.role().toString())),
                oAuth2User.getAttributes(), "id");
    }

    private AppUser createUser(OAuth2User newUser){
        AppUser temp = AppUser.builder()
                .id(newUser.getName())
                .username(newUser.getAttribute("login"))
                .role(UserRole.USER)
                .build();

        appUserRepo.save(temp);
        return temp;
    }
}