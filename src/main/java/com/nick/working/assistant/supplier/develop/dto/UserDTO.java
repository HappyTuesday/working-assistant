package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "supplier_develop_user")
public class UserDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String name;
    @Column(nullable = false)
    private String password;
    private boolean manager;
}
