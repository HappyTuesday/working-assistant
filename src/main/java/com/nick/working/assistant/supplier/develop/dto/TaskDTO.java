package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "supplier_develop_task")
public class TaskDTO {
    @Id
    @GeneratedValue
    private int id;
    @ManyToOne
    @JoinColumn
    private UserDTO owner;
    private String company;
    private String type;
    private String subtype;
    private String desc;
    private boolean done;
}
