package com.nick.working.assistant.supplier.develop.dto;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity(name = "supplier_develop_progress")
public class ProgressDTO {
    @Id
    @GeneratedValue
    private int id;
    private int taskId;
    private String content;
    private String comment;
    private String author;
    private Date timestamp;
}
