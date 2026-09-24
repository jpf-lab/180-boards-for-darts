package org.example.backend.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

// A central helper so that the authority doesn't have to be repeated in every test
public final class TestSecurity {

    private TestSecurity() {}

    public static RequestPostProcessor adminLogin() {
        return SecurityMockMvcRequestPostProcessors.oidcLogin()
                .authorities(new SimpleGrantedAuthority("ADMIN"));
    }
}