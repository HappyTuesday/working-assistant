package com.nick.working.assistant.supplier.develop.controllers;

import com.nick.working.assistant.supplier.develop.dto.ProgressDTO;
import com.nick.working.assistant.supplier.develop.dto.TaskDTO;
import com.nick.working.assistant.supplier.develop.dto.UserDTO;
import com.nick.working.assistant.supplier.develop.models.Progress;
import com.nick.working.assistant.supplier.develop.models.Task;
import com.nick.working.assistant.supplier.develop.models.TaskDetail;
import com.nick.working.assistant.supplier.develop.models.TaskStatus;
import com.nick.working.assistant.supplier.develop.query.TaskQueryCriteria;
import com.nick.working.assistant.supplier.develop.repositories.ProgressRepository;
import com.nick.working.assistant.supplier.develop.repositories.TaskRepository;
import com.nick.working.assistant.supplier.develop.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

@RestController
@RequestMapping("/api/supplier/develop/tasks")
public class TaskController {
    private final TaskRepository repository;
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Autowired
    public TaskController(TaskRepository repository,
                          ProgressRepository progressRepository,
                          UserRepository userRepository) {
        this.repository = repository;
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Task> findAll(TaskQueryCriteria criteria, Long targetDate) {
        Iterable<TaskDTO> iterable = repository.findAll(criteria.toWhereClause());

        List<Task> list = new ArrayList<>();
        for (TaskDTO dto : iterable) {
            List<ProgressDTO> ps = progressRepository.findAllByTaskIdOrderByTimestampDesc(dto.getId());
            list.add(new Task(dto, ps, targetDate));
        }
        return list;
    }

    @GetMapping("excel")
    public ModelAndView exportAllToExcel(TaskQueryCriteria criteria, Long targetDate) {
        return new ModelAndView("tasksExcelView",
            Collections.singletonMap("tasks", findAll(criteria, targetDate)));
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

    private UserDTO getUserDTO(String name) {
        UserDTO userDTO = userRepository.findUserByName(name);
        if (userDTO == null) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
        return userDTO;
    }

    @PutMapping
    public int add(Task task) {
        if (task.getOwner() == null || task.getOwner().getName() == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        TaskDTO dto = task.toDTO();
        dto.setOwner(getUserDTO(task.getOwner().getName()));
        dto.setTaskStatus(TaskStatus.ACTIVE.name());
        dto.setTransitTime(new Date());

        return repository.save(dto).getId();
    }

    @PostMapping
    public void update(Task task) {
        if (task.getOwner() == null || task.getOwner().getName() == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST);
        }

        Optional<TaskDTO> optionalTaskDTO = repository.findById(task.getId());
        if (!optionalTaskDTO.isPresent()) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
        TaskDTO dto = optionalTaskDTO.get();
        dto.setSupplierName(task.getSupplierName());
        dto.setSupplierType(task.getSupplierType());
        dto.setType(task.getType());
        dto.setSubtype(task.getSubtype());
        dto.setDescription(task.getDescription());
        dto.setOwner(getUserDTO(task.getOwner().getName()));

        if (task.getTaskStatus() != null) {
            if (!task.getTaskStatus().name().equals(dto.getTaskStatus())) {
                dto.setTaskStatus(task.getTaskStatus().name());
                dto.setTransitTime(new Date());
            }
        }

        repository.save(dto);
    }

    @PutMapping("progress/{taskId}")
    public void updateProcess(@PathVariable int taskId, String content, String comment, String author) {
        Optional<TaskDTO> result = repository.findById(taskId);
        if (result.isPresent()) {
            TaskDTO task = result.get();
            if (!TaskStatus.ACTIVE.name().equals(task.getTaskStatus())) {
                throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "task is not active");
            }
            ProgressDTO progress = new ProgressDTO();
            progress.setTaskId(taskId);
            progress.setContent(content);
            progress.setComment(comment);
            UserDTO userDTO = userRepository.findUserByName(author);
            if (userDTO == null) {
                throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
            }
            progress.setAuthor(userDTO);
            progress.setTimestamp(new Date());
            progressRepository.save(progress);
        } else {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("finish/{taskId}")
    public void finishTask(@PathVariable int taskId) {
        transitTo(taskId, TaskStatus.FINISHED);
    }

    @PostMapping("cancel/{taskId}")
    public void cancelTask(@PathVariable int taskId) {
        transitTo(taskId, TaskStatus.CANCELED);
    }

    private void transitTo(int taskId, TaskStatus target) {
        Optional<TaskDTO> result = repository.findById(taskId);
        if (result.isPresent()) {
            TaskDTO dto = result.get();
            if (!target.name().equals(dto.getTaskStatus())) {
                dto.setTaskStatus(target.name());
                dto.setTransitTime(new Date());
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
