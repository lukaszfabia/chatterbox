package com.example.profile_service.domain.dto;

import java.time.LocalDateTime;

import com.example.profile_service.domain.events.UserCreatedEvent;
import com.example.profile_service.domain.models.Profile;

public record ProfileDTO(
        int userID,
        String username,
        String email,
        String bio,
        String avatarURL,
        String backgroundURL,
        LocalDateTime createdAt) {

    public ProfileDTO(UserCreatedEvent event) {
        this(event.getUserID(), event.getUsername(), event.getEmail(), null, null, null, null);
    }

    public ProfileDTO(Profile p) {
        this(p.getId(), p.getUsername(), p.getEmail(), p.getBio(), p.getAvatarURL(), p.getBackgroundURL(), p.getCreatedAt())
    }
}
