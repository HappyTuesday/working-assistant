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
    private String supplierName;
    private String supplierType;
    private String type;
    private String subtype;
    private String description;
    private TaskStatus taskStatus;
    private Date transitTime;
    private Progress statusOfYesterday;
    private Progress statusOfToday;

    public Task() {}

    public Task(TaskDTO dto, List<ProgressDTO> progresses) {
        this.id = dto.getId();
        this.owner = new User(dto.getOwner());
        this.supplierName = dto.getSupplierName();
        this.supplierType = dto.getSupplierType();
        this.type = dto.getType();
        this.subtype = dto.getSubtype();
        this.description = dto.getDescription();
        this.taskStatus = dto.getTaskStatus();
        this.transitTime = dto.getTransitTime();

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
        dto.setSupplierName(supplierName);
        dto.setSupplierType(supplierType);
        dto.setType(type);
        dto.setSubtype(subtype);
        dto.setDescription(description);
        dto.setTaskStatus(taskStatus);
        dto.setTransitTime(transitTime);
        return dto;
    }
}
