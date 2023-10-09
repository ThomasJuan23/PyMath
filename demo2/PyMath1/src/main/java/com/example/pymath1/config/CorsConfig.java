package com.example.pymath1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {  //Cross-origin configuration
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080") // Allow cross-origin access on port 8080
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // Allow request type
                        .allowCredentials(true); // allow credential
            }
        };
    }
}
