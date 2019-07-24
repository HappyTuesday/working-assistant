package com.nick.working.assistant.supplier.develop.models;

public enum TaskStatus {
    ACTIVE,
    FINISHED,
    CANCELED;

    public String getTitle() {
        switch (this) {
            case ACTIVE:
                return "跟进中";
            case FINISHED:
                return "已完成";
            case CANCELED:
                return "已终止";
            default:
                return this.toString();
        }
    }
}
