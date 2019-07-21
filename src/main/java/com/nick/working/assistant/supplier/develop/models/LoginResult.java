package com.nick.working.assistant.supplier.develop.models;

import lombok.Data;

@Data
public class LoginResult {
    private User user;
    private String ticket;
}
