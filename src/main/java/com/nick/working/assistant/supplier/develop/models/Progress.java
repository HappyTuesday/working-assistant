package com.nick.working.assistant.supplier.develop.models;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import lombok.Data;

import java.util.Date;

@Data
public class Progress {
    private int id;
    private int taskId;
    private String content;
    private String comment;
    private String author;
    private Date timestamp;

    public Progress() {}

    public Progress(ProgressDTO dto) {
        this.id = dto.getId();
        this.taskId = dto.getTaskId();
        this.content = dto.getContent();
        this.comment = dto.getComment();
        this.author = dto.getAuthor();
        this.timestamp = dto.getTimestamp();
    }

    public ProgressDTO toDTO() {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(id);
        dto.setTaskId(taskId);
        dto.setContent(content);
        dto.setComment(comment);
        dto.setAuthor(author);
        dto.setTimestamp(timestamp);
        return dto;
    }
}
