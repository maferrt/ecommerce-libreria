package com.mundoentrelibros.api.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/health").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/profile").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/profile/address").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/catalog").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sagas").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sagas/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/wishlist").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/wishlist/books/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/wishlist/sagas/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/wishlist/items/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/cart").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/cart/books/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/cart/sagas/**").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/cart/items/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/items/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/cart").authenticated()

                        .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/**").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/forums").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/forums/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/forums/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/forums/**").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        configuration.setAllowedOrigins(origins);

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}