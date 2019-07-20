package com.nick.working.assistant.supplier.develop.models;

import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import lombok.Data;

@Data
public class User {
    private int id;

    private String name;
    private String password;
    private boolean manager;

    public User() {}

    public User(UserDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.password = "******";
        this.manager = dto.isManager();
    }

    public UserDTO toDTO() {
        UserDTO dto = new UserDTO();
        dto.setId(id);
        dto.setName(name);
        dto.setPassword(password);
        dto.setManager(manager);
        return dto;
    }
}
