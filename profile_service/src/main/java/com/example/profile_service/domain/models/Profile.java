package com.example.profile_service.domain.models;

import com.example.profile_service.domain.dto.ProfileDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "profiles", uniqueConstraints = @UniqueConstraint(columnNames = { "username", "email" }))
public class Profile {
    @Id
    @Column(name = "id", updatable = false)
    private int id;

    @Column(name = "username", nullable = false, updatable = true)
    private String username;

    @Column(name = "email", nullable = false, updatable = true)
    private String email;

    @Column(name = "bio", length = 512, nullable = true, updatable = true)
    private String bio;

    @Column(name = "avatar_url", length = 512, nullable = true, updatable = true)
    private String avatarURL;

    @Column(name = "background_url", length = 512, nullable = true, updatable = true)
    private String backgroundURL;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "deleted_at", updatable = true)
    private LocalDateTime deletedAt;

    public Profile() {
    }

    public Profile(ProfileDTO profileDTO) {
        this.id = profileDTO.userID();
        this.email = profileDTO.email();
        this.username = profileDTO.username();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public String getBackgroundURL() {
        return backgroundURL;
    }

    public void setBackgroundURL(String backgroundURL) {
        this.backgroundURL = backgroundURL;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}