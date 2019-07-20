package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity(name = "supplier_develop_task")
public class TaskDTO {
    @Id
    @GeneratedValue
    private int id;
    @Column(nullable = false)
    private String owner;
    private String company;
    private String type;
    private String subtype;
    private String desc;
    private boolean done;
}
