package com.example.pymath1.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080") // 允许 localhost:8080 访问
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS") // 允许的请求方法
                        .allowCredentials(true); // 允许证书 不设置时也是默认为true
            }
        };
    }
}
