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
    private User author;
    private long timestamp;

    public Progress() {}

    public Progress(ProgressDTO dto) {
        this.id = dto.getId();
        this.taskId = dto.getTaskId();
        this.content = dto.getContent();
        this.comment = dto.getComment();
        this.author = new User(dto.getAuthor());
        this.timestamp = dto.getTimestamp().getTime();
    }
}
