package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity(name = "supplier_develop_task")
public class TaskDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn
    private UserDTO owner;
    private String supplierName;
    private String supplierType;
    private String type;
    private String subtype;
    private String description;
    private boolean done;
    private Date doneTime;
}
