package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity(name = "supplier_develop_progress")
public class ProgressDTO {
    @Id
    @GeneratedValue
    private int id;
    private int taskId;
    @ManyToOne
    @JoinColumn
    private UserDTO author;
    private String content;
    private String comment;
    private Date timestamp;
}
