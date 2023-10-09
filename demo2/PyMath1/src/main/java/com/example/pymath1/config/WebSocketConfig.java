package com.example.pymath1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        // Enabling a simple in-memory broker with destination prefix "/topic"
        config.setApplicationDestinationPrefixes("/app");
    } // Setting application destination prefix for client-to-server destination addresses

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Registering a WebSocket endpoint at the given URL path and allowing cross-origin access from "http://localhost:8080"
        registry.addEndpoint("/websocket-endpoint").setAllowedOrigins("http://localhost:8080")
                .withSockJS();
    }
}