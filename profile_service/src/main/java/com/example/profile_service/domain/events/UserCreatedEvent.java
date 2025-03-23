package com.example.profile_service.domain.events;

public class UserCreatedEvent implements Event {
    private final int userID;
    private final String email;
    private final String username;

    public UserCreatedEvent(int userID, String email, String username) {
        this.userID = userID;
        this.email = email;
        this.username = username;
    }

    public int getUserID() {
        return userID;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }
}