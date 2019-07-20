package com.nick.working.assistant.supplier.develop.controllers;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.models.Progress;
import com.nick.working.assistant.supplier.develop.models.Task;
import com.nick.working.assistant.supplier.develop.models.TaskDetail;
import com.nick.working.assistant.supplier.develop.repositories.ProgressRepository;
import com.nick.working.assistant.supplier.develop.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/supplier/develop/tasks")
public class TaskController {
    private final TaskRepository repository;
    private final ProgressRepository progressRepository;

    @Autowired
    public TaskController(TaskRepository repository, ProgressRepository progressRepository) {
        this.repository = repository;
        this.progressRepository = progressRepository;
    }

    @GetMapping
    public List<Task> findAll(Boolean done, String owner) {
        Iterable<TaskDTO> iterable;
        if (done != null && owner != null) {
            iterable = repository.findAllByOwnerAndDone(owner, done);
        } else if (done != null) {
            iterable = repository.findAllByDone(done);
        } else if (owner != null) {
            iterable = repository.findAllByOwner(owner);
        } else {
            iterable = repository.findAll();
        }

        List<Task> list = new ArrayList<>();
        for (TaskDTO dto : iterable) {
            list.add(new Task(dto, progressRepository.findAllByTaskIdOrderByTimestampDesc(dto.getId())));
        }
        return list;
    }

    @GetMapping("{id}")
    public Task get(@PathVariable int id) {
        Optional<TaskDTO> result = repository.findById(id);
        if (result.isPresent()) {
            return new Task(result.get(), progressRepository.findAllByTaskIdOrderByTimestampDesc(id));
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("detail/{id}")
    public TaskDetail getDetail(@PathVariable int id) {
        Optional<TaskDTO> result = repository.findById(id);
        if (result.isPresent()) {
            List<ProgressDTO> progressDTOS = progressRepository.findAllByTaskIdOrderByTimestampDesc(id);
            Task task = new Task(result.get(), progressDTOS);
            List<Progress> progresses = new ArrayList<>(progressDTOS.size());
            for (ProgressDTO dto : progressDTOS) {
                progresses.add(new Progress(dto));
            }
            return new TaskDetail(task, progresses);
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping
    public int add(Task task) {
        return repository.save(task.toDTO()).getId();
    }

    @PostMapping
    public void update(Task task) {
        repository.save(task.toDTO());
    }

    @PutMapping("progress/{taskId}")
    public void updateProcess(@PathVariable int taskId, String content, String comment, String author) {
        Optional<TaskDTO> result = repository.findById(taskId);
        if (result.isPresent()) {
            if (result.get().isDone()) {
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "task already done");
            }
            ProgressDTO progress = new ProgressDTO();
            progress.setTaskId(taskId);
            progress.setContent(content);
            progress.setComment(comment);
            progress.setAuthor(author);
            progress.setTimestamp(new Date());
            progressRepository.save(progress);
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("finish/{taskId}")
    public void finishTask(@PathVariable int taskId) {
        Optional<TaskDTO> result = repository.findById(taskId);
        if (result.isPresent()) {
            TaskDTO dto = result.get();
            if (!dto.isDone()) {
                dto.setDone(true);
                repository.save(dto);
            }
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("{taskId}")
    public void delete(@PathVariable int taskId) {
        repository.deleteById(taskId);
    }
}
