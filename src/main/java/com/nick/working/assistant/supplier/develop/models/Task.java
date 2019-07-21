package com.nick.working.assistant.supplier.develop.models;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import lombok.Data;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Data
public class Task {
    private int id;
    private User owner;
    private String company;
    private String type;
    private String subtype;
    private String description;
    private boolean done;
    private Date doneTime;
    private Progress statusOfYesterday;
    private Progress statusOfToday;

    public Task() {}

    public Task(TaskDTO dto, List<ProgressDTO> progresses) {
        this.id = dto.getId();
        this.owner = new User(dto.getOwner());
        this.company = dto.getCompany();
        this.type = dto.getType();
        this.subtype = dto.getSubtype();
        this.description = dto.getDescription();
        this.done = dto.isDone();
        this.doneTime = dto.getDoneTime();

        if (!progresses.isEmpty()) {
            ProgressDTO p = progresses.get(0);
            this.statusOfToday = new Progress(p);
            Date today = getToday();
            for (ProgressDTO q : progresses) {
                if (q.getTimestamp().before(today)) {
                    this.statusOfYesterday = new Progress(q);
                    break;
                }
            }
        }
    }

    private Date getToday() {
        Calendar now = Calendar.getInstance();
        Calendar today = new Calendar.Builder()
            .set(Calendar.YEAR, now.get(Calendar.YEAR))
            .set(Calendar.MONTH, now.get(Calendar.MONTH))
            .set(Calendar.DATE, now.get(Calendar.DATE))
            .build();
        return today.getTime();
    }

    public TaskDTO toDTO() {
        TaskDTO dto = new TaskDTO();
        dto.setId(id);
        if (owner != null) {
            dto.setOwner(owner.toDTO());
        }
        dto.setCompany(company);
        dto.setType(type);
        dto.setSubtype(subtype);
        dto.setDescription(description);
        dto.setDone(done);
        dto.setDoneTime(doneTime);
        return dto;
    }
}
