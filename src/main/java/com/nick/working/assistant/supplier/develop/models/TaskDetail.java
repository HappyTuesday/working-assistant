package com.nick.working.assistant.supplier.develop.models;

import lombok.Data;

import java.util.List;

@Data
public class TaskDetail {
    private Task task;
    private List<Progress> history;

    public TaskDetail() {}

    public TaskDetail(Task task, List<Progress> history) {
        this.task = task;
        this.history = history;
    }
}
