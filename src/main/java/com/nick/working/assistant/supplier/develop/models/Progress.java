package com.nick.working.assistant.supplier.develop.models;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import lombok.Data;

import java.util.Calendar;
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

    public String getDetailText() {
        if (comment == null || comment.isEmpty()) {
            return content;
        }
        return String.format("%s - %s", content, comment);
    }

    public boolean belongsToToday() {
        return today().getTime() <= timestamp;
    }

    public static Date today() {
        Calendar c = Calendar.getInstance();
        c.set(Calendar.HOUR, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        return c.getTime();
    }
}
