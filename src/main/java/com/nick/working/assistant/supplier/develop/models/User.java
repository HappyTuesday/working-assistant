package com.nick.working.assistant.supplier.develop.models;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import lombok.Data;

@Data
public class User {
    private int id;

    private String username;
    private String password;
    private boolean manager;

    public User() {}

    public User(UserDTO dto) {
        this.id = dto.getId();
        this.username = dto.getUsername();
        this.password = dto.getPassword();
        this.manager = dto.isManager();
    }

    public UserDTO toDTO() {
        UserDTO dto = new UserDTO();
        dto.setId(id);
        dto.setUsername(username);
        dto.setPassword(password);
        dto.setManager(manager);
        return dto;
    }
}
